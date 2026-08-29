import { useEffect, useState } from "react";

const DISMISS_KEY = "kaziflow_install_dismissed_at";
const DISMISS_DAYS = 14;

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true // iOS Safari
  );
}

function isIOS() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function wasRecentlyDismissed() {
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const daysSince = (Date.now() - Number(raw)) / (1000 * 60 * 60 * 24);
  return daysSince < DISMISS_DAYS;
}

/**
 * Drop this inside DashboardLayout (renders nothing if the app is
 * already installed, was dismissed recently, or install isn't
 * supported/relevant on this device).
 *
 * Android/Chrome: listens for `beforeinstallprompt`, shows a custom
 * banner, triggers the native prompt on click.
 * iOS Safari: doesn't fire that event at all, so shows manual
 * "tap Share, then Add to Home Screen" instructions instead.
 */
export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [dismissed, setDismissed] = useState(wasRecentlyDismissed());

  useEffect(() => {
    if (isStandalone() || dismissed) return;

    function handleBeforeInstall(e) {
      e.preventDefault();
      setDeferredPrompt(e);
    }
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    if (isIOS()) {
      setShowIOSHint(true);
    }

    return () =>
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, [dismissed]);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setDismissed(true);
  }

  async function handleInstallClick() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  if (dismissed || isStandalone()) return null;
  if (!deferredPrompt && !showIOSHint) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:left-auto sm:w-80 z-50">
      <div className="rounded-2xl border border-white/12 bg-[#0d1420] shadow-xl p-4 flex gap-3 items-start">
        <div className="w-9 h-9 rounded-full bg-[#dc9b5f] text-[#0a0f1a] grid place-items-center text-sm font-bold shrink-0">
          K
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#f3efe4]">
            Install the KaziFlow app
          </p>
          {showIOSHint && !deferredPrompt ? (
            <p className="text-xs text-[#98a2b3] mt-1 leading-relaxed">
              Tap <span className="text-[#f3efe4]">Share</span>, then{" "}
              <span className="text-[#f3efe4]">Add to Home Screen</span> for
              one-tap access to your dashboard.
            </p>
          ) : (
            <p className="text-xs text-[#98a2b3] mt-1">
              Get one-tap access to your dashboard from your home screen.
            </p>
          )}

          <div className="flex items-center gap-3 mt-3">
            {deferredPrompt && (
              <button
                onClick={handleInstallClick}
                className="bg-[#dc9b5f] text-[#0a0f1a] text-xs font-semibold rounded-full px-3.5 py-1.5"
              >
                Install
              </button>
            )}
            <button
              onClick={dismiss}
              className="text-xs text-[#6b7280] hover:text-[#98a2b3]"
            >
              {deferredPrompt ? "Not now" : "Got it"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}