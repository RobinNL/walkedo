"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Styles from "./not-found.module.scss";

/**
 * Easter egg for the 404 page. The heading says a dog has lost the ball;
 * the ball is hiding somewhere on the page. Click it and a dog dashes in to
 * fetch it, then it gets thrown to a new hiding spot.
 */

// Hiding spots as % of the container. Kept away from the centred text.
const SPOTS = [
    { left: 92, top: 82 },
    { left: 6, top: 88 },
    { left: 88, top: 8 },
    { left: 4, top: 12 },
    { left: 50, top: 96 },
];

// Total duration of the dash animation in not-found.module.scss.
const DASH_MS = 1400;

export default function FetchEasterEgg() {
    const t = useTranslations("notFound");
    const [spot, setSpot] = useState(0);
    const [fetches, setFetches] = useState(0);
    const [fetching, setFetching] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => () => clearTimeout(timer.current), []);

    const fetchBall = () => {
        if (fetching) return;
        setFetching(true);
        timer.current = setTimeout(() => {
            setFetches((n) => n + 1);
            setSpot((s) => (s + 1) % SPOTS.length);
            setFetching(false);
        }, DASH_MS);
    };

    const { left, top } = SPOTS[spot];

    return (
        <>
            {!fetching && (
                <button
                    type="button"
                    className={Styles.ball}
                    style={{ left: `${left}%`, top: `${top}%` }}
                    onClick={fetchBall}
                    aria-label={t("ballLabel")}
                    title={t("ballLabel")}
                >
                    🎾
                </button>
            )}

            {fetching && (
                <span
                    className={Styles.dog}
                    style={{ top: `${top}%` }}
                    aria-hidden="true"
                >
                    🐕
                </span>
            )}

            <p className={Styles.fetchStatus} aria-live="polite">
                {fetches > 0 && t("found", { count: fetches })}
            </p>
        </>
    );
}
