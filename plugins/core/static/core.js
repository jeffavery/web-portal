// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0-or-later
"use-strict";

const core__sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

/**
 * Setup a clock widget, starting a infinite loop for updating the display
 * @param {string} widget_id - The widgets outer element id
 */
async function core__clock_init(widget_id) {
    let time_display = document.querySelector(`#${widget_id} .core__clock_display .time`);
    let date_display = document.querySelector(`#${widget_id} .core__clock_display .date`);
    while (true) {
        core__clock_update(time_display, date_display);
        await core__sleep(1000);
    };
}

/**
 * Update the clocks display
 * @param {Element} time_display - The time element
 * @param {Element} date_display - The date element
 */
function core__clock_update(time_display, date_display) {
    let current_dt = new Date();

    let hour = current_dt.getHours().toString().padStart(2, "0");
    let minute = current_dt.getMinutes().toString().padStart(2, "0");
    let second = current_dt.getSeconds().toString().padStart(2, "0");
    time_display.innerText = `${hour}:${minute}:${second}`;

    let day = current_dt.getDate().toString().padStart(2, "0");
    let month = (current_dt.getMonth() + 1).toString().padStart(2, "0");
    let year = current_dt.getFullYear().toString();
    let date_text = `${day}-${month}-${year}`;
    // only update date if different
    if (date_display.innerText !== date_text) {
        date_display.innerText = date_text;
    }
}

const core__color_classes = [
    "no-color", "white", "grey", "grey-black", "black", "red", "orange", "yellow",
    "green", "green-blue", "cyan", "blue", "purple", "pink", "pink-red", "red-alt",
    "orange-alt", "yellow-alt", "green-alt", "green-blue-alt", "cyan-alt", "blue-alt",
    "purple-alt", "pink-alt", "pink-red-alt",
];

const core__text_color_classes = [
    "tile-text-auto", ...core__color_classes.map((color) => `tile-text-${color}`),
];

function core__update_link_preview(form) {
    const preview = form.querySelector(".core-link-preview");
    if (!preview) return;

    const chip = preview.querySelector(".chip");
    const tile = preview.querySelector(".inner");
    const label = preview.querySelector(".inner span");
    const name = form.querySelector('[name="name"]');
    const accent = form.querySelector('[name="color_name"]');
    const background = form.querySelector('[name="background_color_name"]');
    const text = form.querySelector('[name="text_color_name"]');

    chip.classList.remove(...core__color_classes);
    chip.classList.add(accent.value);
    tile.classList.remove(...core__color_classes, ...core__text_color_classes);
    tile.classList.add(background.value, `tile-text-${text.value}`);
    label.textContent = name.value.trim() || "New Link";
}

function core__setup_link_appearance_forms() {
    document.querySelectorAll("[data-link-appearance-form]").forEach((form) => {
        form.addEventListener("input", () => core__update_link_preview(form));
        form.addEventListener("change", () => core__update_link_preview(form));
        core__update_link_preview(form);
    });
}

function core__setup_collapsible_widgets() {
    document.querySelectorAll('[data-collapsible="true"]').forEach((widget) => {
        const toggle = widget.querySelector(".widget-collapse-toggle");
        if (!toggle) return;

        const storageKey = `web-portal:widget-collapsed:${widget.id}`;
        let isCollapsed = widget.dataset.startCollapsed === "true";
        try {
            const savedState = window.localStorage.getItem(storageKey);
            if (savedState !== null) isCollapsed = savedState === "true";
        } catch (_error) {
            // Local storage may be disabled; the configured default still works.
        }

        const applyState = () => {
            widget.classList.toggle("is-collapsed", isCollapsed);
            toggle.setAttribute("aria-expanded", String(!isCollapsed));
            toggle.title = isCollapsed ? "Expand section" : "Collapse section";
        };

        toggle.addEventListener("click", () => {
            isCollapsed = !isCollapsed;
            applyState();
            try {
                window.localStorage.setItem(storageKey, String(isCollapsed));
            } catch (_error) {
                // Keep the interaction working even if local storage is disabled.
            }
        });

        applyState();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    core__setup_link_appearance_forms();
    core__setup_collapsible_widgets();
});
// @license-end
