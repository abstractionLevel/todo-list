export function openToast(message) {
    let detail = {
        message:message
    }
    return window.dispatchEvent(new CustomEvent("openToast",{detail:detail}));
}