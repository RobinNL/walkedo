'use client';

import React, { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Styles from "./pricing.module.scss";

export type PricingService = "uitlaatservice" | "dagopvang";

const SERVICES: readonly PricingService[] = ["uitlaatservice", "dagopvang"];

/** Monthly subscription amounts, indexed by the number of days per week. */
const PRICES: Record<PricingService, string[]> = {
    uitlaatservice: ['€51,75', '€103,50', '€155,25', '€207,00', '€257,75'],
    dagopvang: ['€71,10', '€134,15', '€201,25', '€268,35', '€335,50'],
};

export interface PricingProps {
    /** The service shown until the visitor picks the other one. */
    defaultService: PricingService;
}

/**
 * The subscription prices for both services, with a toggle to switch between
 * them, so a visitor on either page can compare without navigating away.
 *
 * The toggle follows the ARIA tabs pattern: one tab stop for the whole strip,
 * arrow keys move between the two options.
 */
export const WalkedoPricing = ({ defaultService }: PricingProps) => {
    const t = useTranslations('pricing');
    const [service, setService] = useState<PricingService>(defaultService);
    const tabs = useRef<Partial<Record<PricingService, HTMLButtonElement | null>>>({});

    const select = (next: PricingService) => {
        setService(next);
        tabs.current[next]?.focus();
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        const current = SERVICES.indexOf(service);

        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                select(SERVICES[(current + SERVICES.length - 1) % SERVICES.length]);
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                select(SERVICES[(current + 1) % SERVICES.length]);
                break;
            case 'Home':
                select(SERVICES[0]);
                break;
            case 'End':
                select(SERVICES[SERVICES.length - 1]);
                break;
            default:
                return;
        }

        event.preventDefault();
    };

    return (
        <div className={Styles.pricing}>
            <div className={Styles.serviceToggle} role="tablist" aria-label={t('toggleLabel')}>
                {SERVICES.map((option) => (
                    <button
                        key={option}
                        ref={(element) => { tabs.current[option] = element; }}
                        type="button"
                        role="tab"
                        id={`pricing-tab-${option}`}
                        aria-selected={service === option}
                        aria-controls={`pricing-panel-${option}`}
                        tabIndex={service === option ? 0 : -1}
                        className={`${Styles.serviceOption} ${service === option ? Styles.serviceOptionSelected : ''}`}
                        onClick={() => setService(option)}
                        onKeyDown={onKeyDown}
                    >
                        {t(`services.${option}`)}
                    </button>
                ))}
            </div>

            <div
                className={Styles.subscriptionRow}
                role="tabpanel"
                id={`pricing-panel-${service}`}
                aria-labelledby={`pricing-tab-${service}`}
                tabIndex={0}
            >
                {PRICES[service].map((price, index) => (
                    <div className={Styles.subscriptionBlock} key={price}>
                        <h3>{price}</h3>
                        <p>{t('perWeek', { count: index + 1 })}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
