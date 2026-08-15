import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware replacements for next/link and next/navigation. Importing Link
 * from here rather than next/link is what keeps internal navigation inside the
 * active locale.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
