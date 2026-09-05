"use client";

import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";
import Styles from "./carousel.module.scss";

/**
 * Replaces react-multi-carousel, which was dropped from the dependency tree.
 *
 * That package listed `npm` (the CLI, 17 MB) and `install` among its runtime
 * dependencies -- almost certainly by accident -- and those two pulled in 22 of
 * the 38 advisories `npm audit` reported, including both criticals. Nothing in
 * the package had been published since April 2025, so there was no fixed
 * version to move to. The carousel is used on exactly one page, so carrying
 * that tree for it was not a reasonable trade.
 *
 * The behaviour reproduced here is what the casting page actually asked for:
 * 3/2/1 items per view by breakpoint, drag and swipe, autoplay with
 * pause-on-hover, keyboard control, and a seamless infinite loop.
 *
 * Scrolling is native (CSS scroll-snap) rather than a transform the script
 * animates itself. That is what gives touch swipe, trackpad drag, momentum and
 * accessible focus handling for free; the script only has to advance the
 * scroll position and keep the loop seamless.
 */

/**
 * Slides are rendered three times over and the viewport starts on the middle
 * copy, so there is always a full set of slides to scroll into on either side.
 * When the scroll position drifts into the first or last copy it is snapped
 * back by exactly one copy's width, which lands on an identical slide and is
 * therefore invisible. This is the standard trick for an infinite scroll-snap
 * track and it is why the loop has no jump at the seam.
 */
const COPIES = 3;
const MIDDLE_COPY = 1;

/**
 * Length of an arrow/autoplay slide, matching the `transitionDuration={1600}`
 * the page passed to react-multi-carousel, so the gallery keeps the slow,
 * deliberate pace it was art-directed with.
 */
const TRANSITION_MS = 1600;

type CarouselProps = {
    /** One node per slide. Cloned internally; keys are assigned here. */
    slides: readonly { key: string; node: ReactNode }[];
    /** ms between automatic advances. 0 disables autoplay entirely. */
    autoPlaySpeed?: number;
    /** Accessible name for the whole region, e.g. "Photo gallery". */
    label: string;
    previousLabel: string;
    nextLabel: string;
};

export function Carousel({
    slides,
    autoPlaySpeed = 7000,
    label,
    previousLabel,
    nextLabel,
}: CarouselProps) {
    const trackRef = useRef<HTMLUListElement>(null);
    const count = slides.length;

    // Autoplay is suspended while the visitor is interacting with the carousel
    // (hover, focus, an in-progress drag) or while the tab is in the background.
    const [paused, setPaused] = useState(false);
    const draggingRef = useRef(false);

    /** Width of one slide including its gutter, measured from the live DOM. */
    const slideWidth = useCallback(() => {
        const track = trackRef.current;
        if (!track) return 0;
        // scrollWidth covers all COPIES * count slides, so this stays correct
        // whatever the breakpoint decided each slide should be.
        return track.scrollWidth / (COPIES * count);
    }, [count]);

    /** Re-centre on the middle copy without animating. */
    const recentre = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;
        track.scrollLeft = slideWidth() * count * MIDDLE_COPY;
    }, [count, slideWidth]);

    // Must run before paint, otherwise the first frame shows the track parked
    // at the start of the first copy and visibly jumps to the middle.
    useLayoutEffect(() => {
        recentre();
    }, [recentre]);

    // Breakpoint changes alter how wide a slide is, which invalidates the
    // scroll offset the loop maths depends on.
    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;
        const observer = new ResizeObserver(() => recentre());
        observer.observe(track);
        return () => observer.disconnect();
    }, [recentre]);

    /**
     * True while an arrow/autoplay slide is animating, so the loop correction in
     * onScroll leaves the animation alone and runs once at the end instead.
     */
    const animatingRef = useRef(false);
    const frameRef = useRef(0);

    /**
     * Keep the visitor inside the middle copy. Runs on scroll rather than on a
     * timer so it catches manual swipes as well as autoplay steps.
     */
    const onScroll = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;
        // Mid-tween the position is deliberately between snap points; correcting
        // it here would yank the animation. step() calls this once it settles.
        if (animatingRef.current) return;
        const copyWidth = slideWidth() * count;
        if (copyWidth === 0) return;

        // A half-copy margin either side: far enough that the correction never
        // fires mid-gesture, close enough that it always fires before the
        // visitor can reach a real edge.
        const lower = copyWidth * MIDDLE_COPY - copyWidth / 2;
        const upper = copyWidth * MIDDLE_COPY + copyWidth / 2;

        if (track.scrollLeft < lower) {
            track.scrollLeft += copyWidth;
        } else if (track.scrollLeft > upper) {
            track.scrollLeft -= copyWidth;
        }
    }, [count, slideWidth]);

    /**
     * Scrolls one slide.
     *
     * The obvious implementation -- `scrollBy({ behavior: "smooth" })` -- does
     * not work here. On a container with `scroll-snap-type: x mandatory` the
     * snap algorithm cancels a programmatic smooth scroll: measured against
     * this page, a smooth scrollBy of exactly one slide width left scrollLeft
     * completely unchanged, while the same call with `behavior: "auto"` moved
     * it correctly. So the tween is done by hand, with snapping switched off
     * for its duration and restored at the end -- which is also what lets the
     * duration match the old carousel's 1.6s rather than the browser's.
     */
    const step = useCallback(
        (direction: 1 | -1) => {
            const track = trackRef.current;
            if (!track) return;

            cancelAnimationFrame(frameRef.current);

            const from = track.scrollLeft;
            const to = from + slideWidth() * direction;

            const settle = () => {
                animatingRef.current = false;
                track.style.scrollSnapType = "";
                onScroll();
            };

            // Jump rather than tween when an animation would be wrong or
            // impossible: a visitor who asked for less motion, and a hidden tab,
            // where requestAnimationFrame does not fire at all -- tweening there
            // would strand the track mid-slide with snapping disabled until the
            // tab came back.
            const reduceMotion =
                typeof window !== "undefined" &&
                window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            if (reduceMotion || document.hidden) {
                track.scrollLeft = to;
                settle();
                return;
            }

            animatingRef.current = true;
            // Snapping would fight every intermediate frame; the tween lands on
            // a snap point by construction, so nothing is lost by turning it off.
            track.style.scrollSnapType = "none";

            const started = performance.now();
            const tick = (now: number) => {
                const t = Math.min((now - started) / TRANSITION_MS, 1);
                // easeInOutCubic
                const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
                track.scrollLeft = from + (to - from) * eased;
                if (t < 1) {
                    frameRef.current = requestAnimationFrame(tick);
                } else {
                    settle();
                }
            };
            frameRef.current = requestAnimationFrame(tick);
        },
        [slideWidth, onScroll],
    );

    useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

    // Autoplay. Honours prefers-reduced-motion: a visitor who has asked for less
    // motion gets a carousel they drive themselves rather than no carousel.
    useEffect(() => {
        if (!autoPlaySpeed || paused) return;
        if (
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            return;
        }
        const id = window.setInterval(() => step(1), autoPlaySpeed);
        return () => window.clearInterval(id);
    }, [autoPlaySpeed, paused, step]);

    // Advancing a carousel nobody can see wastes work and, worse, lets the
    // scroll position drift while the tab is throttled.
    useEffect(() => {
        const onVisibility = () => setPaused(document.hidden);
        // Seed from the current state as well as subscribing: a tab opened in
        // the background fires no visibilitychange, so without this the
        // carousel would autoplay in a tab the visitor has never looked at.
        onVisibility();
        document.addEventListener("visibilitychange", onVisibility);
        return () => document.removeEventListener("visibilitychange", onVisibility);
    }, []);

    /**
     * Pointer drag. Touch and trackpad already scroll the track natively; this
     * only adds click-and-drag for a mouse, which native overflow scrolling
     * does not provide.
     */
    const dragStart = useRef({ x: 0, scrollLeft: 0 });

    const onPointerDown = (event: React.PointerEvent<HTMLUListElement>) => {
        // Let touch and pen fall through to native scrolling, which handles
        // momentum and snapping far better than anything reimplemented here.
        if (event.pointerType !== "mouse") return;
        const track = trackRef.current;
        if (!track) return;
        draggingRef.current = true;
        dragStart.current = { x: event.clientX, scrollLeft: track.scrollLeft };
        setPaused(true);
    };

    const onPointerMove = (event: React.PointerEvent<HTMLUListElement>) => {
        if (!draggingRef.current) return;
        const track = trackRef.current;
        if (!track) return;
        event.preventDefault();
        track.scrollLeft = dragStart.current.scrollLeft - (event.clientX - dragStart.current.x);
    };

    const endDrag = () => {
        draggingRef.current = false;
    };

    return (
        <section
            className={Styles.carousel}
            aria-roledescription="carousel"
            aria-label={label}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => {
                endDrag();
                setPaused(false);
            }}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
        >
            <button
                type="button"
                className={`${Styles.arrow} ${Styles.arrowPrev}`}
                aria-label={previousLabel}
                onClick={() => step(-1)}
            >
                <span aria-hidden="true">‹</span>
            </button>

            <ul
                ref={trackRef}
                className={Styles.track}
                onScroll={onScroll}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                // Native list semantics would announce a misleading count, since
                // every slide is present three times over.
                role="group"
                aria-label={label}
                tabIndex={0}
                onKeyDown={(event) => {
                    if (event.key === "ArrowRight") {
                        event.preventDefault();
                        step(1);
                    } else if (event.key === "ArrowLeft") {
                        event.preventDefault();
                        step(-1);
                    }
                }}
            >
                {Array.from({ length: COPIES }).flatMap((_, copy) =>
                    slides.map((slide, index) => (
                        <li
                            key={`${copy}-${slide.key}`}
                            className={Styles.slide}
                            // Only the middle copy is the real content; the other
                            // two exist to make the loop seamless and would
                            // otherwise be announced as duplicates.
                            aria-hidden={copy !== MIDDLE_COPY}
                            aria-label={`${index + 1} / ${count}`}
                            aria-roledescription="slide"
                        >
                            {slide.node}
                        </li>
                    )),
                )}
            </ul>

            <button
                type="button"
                className={`${Styles.arrow} ${Styles.arrowNext}`}
                aria-label={nextLabel}
                onClick={() => step(1)}
            >
                <span aria-hidden="true">›</span>
            </button>
        </section>
    );
}
