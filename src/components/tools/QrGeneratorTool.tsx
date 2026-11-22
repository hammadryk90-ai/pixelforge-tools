"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Download, Link2, Wifi, Mail, Type } from "lucide-react";

type QrMode = "url" | "wifi" | "email" | "text";

export default function QrGeneratorTool() {
  const [mode, setMode] = useState<QrMode>("url");
  const [urlValue, setUrlValue] = useState("https://pixelforgeimg.com");
  const [textValue, setTextValue] = useState("");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [wifiAuth, setWifiAuth] = useState<"WPA" | "WEP" | "nopass">("WPA");
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");

  const [fgColor, setFgColor] = useState("#0f172a");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(512);

  const [pngUrl, setPngUrl] = useState("");
  const [svgMarkup, setSvgMarkup] = useState("");

  const getPayload = () => {
    if (mode === "url") return urlValue.trim() || "https://pixelforgeimg.com";
    if (mode === "text") return textValue.trim() || "Hello from PixelForge";
    if (mode === "email") {
      const to = emailTo.trim() || "hello@example.com";
      const sub = emailSubject.trim()
        ? `?subject=${encodeURIComponent(emailSubject.trim())}`
        : "";
      return `mailto:${to}${sub}`;
    }
    // WiFi QR format
    const ssid = wifiSsid.replace(/([\\;,:"])/g, "\\$1");
    const pass = wifiPass.replace(/([\\;,:"])/g, "\\$1");
    return `WIFI:T:${wifiAuth};S:${ssid || "MyWiFi"};P:${wifiAuth === "nopass" ? "" : pass};;`;
  };

  useEffect(() => {
    let active = true;
    const payload = getPayload();

    const generate = async () => {
      try {
        const [dataUrl, svg] = await Promise.all([
          QRCode.toDataURL(payload, {
            width: size,
            margin: 2,
            color: { dark: fgColor, light: bgColor },
          }),
          QRCode.toString(payload, {
            type: "svg",
            margin: 2,
            color: { dark: fgColor, light: bgColor },
          }),
        ]);
        if (active) {
          setPngUrl(dataUrl);
          setSvgMarkup(svg);
        }
      } catch {
        // Ignore transient invalid input
      }
    };

    generate();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mode,
    urlValue,
    textValue,
    wifiSsid,
    wifiPass,
    wifiAuth,
    emailTo,
    emailSubject,
    fgColor,
    bgColor,
    size,
  ]);

  const downloadSvg = () => {
    if (!svgMarkup) return;
    const blob = new Blob([svgMarkup], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pixelforge-qr-${mode}.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const modes: { id: QrMode; label: string; icon: typeof Link2 }[] = [
    { id: "url", label: "URL / Link", icon: Link2 },
    { id: "wifi", label: "WiFi", icon: Wifi },
    { id: "email", label: "Email", icon: Mail },
    { id: "text", label: "Plain Text", icon: Type },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Controls */}
      <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7">
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 sm:grid-cols-4">
          {modes.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-colors ${
                  mode === m.id
                    ? "bg-white text-cyan-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {m.label}
              </button>
            );
          })}
        </div>

        {mode === "url" && (
          <div>
            <label
              htmlFor="qr-url"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Website URL
            </label>
            <input
              id="qr-url"
              type="url"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900"
            />
          </div>
        )}

        {mode === "text" && (
          <div>
            <label
              htmlFor="qr-text"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Text Content
            </label>
            <textarea
              id="qr-text"
              rows={3}
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="Enter any message, phone number, or note..."
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900"
            />
          </div>
        )}

        {mode === "wifi" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Network Name (SSID)
              </label>
              <input
                type="text"
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                placeholder="HomeWiFi"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Security
              </label>
              <select
                value={wifiAuth}
                onChange={(e) =>
                  setWifiAuth(e.target.value as "WPA" | "WEP" | "nopass")
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
              >
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None (Open)</option>
              </select>
            </div>
            {wifiAuth !== "nopass" && (
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  WiFi Password
                </label>
                <input
                  type="text"
                  value={wifiPass}
                  onChange={(e) => setWifiPass(e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
                />
              </div>
            )}
          </div>
        )}

        {mode === "email" && (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Recipient Email
              </label>
              <input
                type="email"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Subject (optional)
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Hello!"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
              />
            </div>
          </div>
        )}

        {/* Style customization */}
        <div className="grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              QR Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="h-9 w-11 cursor-pointer rounded border border-slate-300"
              />
              <span className="font-mono text-xs text-slate-500">{fgColor}</span>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Background
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-9 w-11 cursor-pointer rounded border border-slate-300"
              />
              <span className="font-mono text-xs text-slate-500">{bgColor}</span>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              PNG Resolution
            </label>
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-800"
            >
              <option value={256}>256 × 256px</option>
              <option value={512}>512 × 512px (HD)</option>
              <option value={1024}>1024 × 1024px (Print)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Live Preview & Download */}
      <div className="flex flex-col items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5">
        <p className="text-sm font-bold text-slate-900">Live QR Code Preview</p>

        <div className="my-5 flex h-60 w-60 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-3">
          {pngUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={pngUrl}
              alt="Generated QR code"
              className="h-full w-full rounded-lg object-contain"
            />
          ) : (
            <span className="text-xs text-slate-400">Generating QR...</span>
          )}
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row">
          {pngUrl && (
            <a
              href={pngUrl}
              download={`pixelforge-qr-${mode}.png`}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700"
            >
              <Download className="h-4 w-4" />
              Download PNG
            </a>
          )}
          <button
            type="button"
            onClick={downloadSvg}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            <Download className="h-4 w-4" />
            Download SVG
          </button>
        </div>
      </div>
    </div>
  );
}
