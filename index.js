/**
 * Loader entry for the Host half.
 *
 * This plugin only contributes a Client-side label renderer, so the Host half
 * has nothing to mount. The browser entry is picked up through the `dsh.client`
 * section of package.json.
 */
export function apply() {}
