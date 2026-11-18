"use client";

import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

interface AnimatedRaysProps {
    /** Additional CSS classes */
    className?: string;
    /** Optional children to render over the background */
    children?: React.ReactNode;
}

export function AnimatedRays({
    className = "",
    children,
}: AnimatedRaysProps) {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [palette, setPalette] = useState("ocean");
    const [intensity, setIntensity] = useState(55);

    useEffect(() => {
        setMounted(true);
        const checkDark = () => document.documentElement.classList.contains("dark");
        setIsDark(checkDark());

        const observer = new MutationObserver(() => setIsDark(checkDark()));
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => observer.disconnect();
    }, []);

    if (!mounted) return null;

    const palettes: Record<string, string> = {
        ocean: "#60a5fa, #e879f9, #5eead4",
        sunset: "#fb7185, #fbbf24, #c084fc",
        forest: "#34d399, #a3e635, #38bdf8",
    };
    const [firstColor, secondColor, thirdColor] = palettes[palette].split(", ");
    const strength = intensity / 100;
    const stripeColor = isDark
        ? `rgba(255, 255, 255, ${strength * 0.45})`
        : `rgba(15, 23, 42, ${strength * 0.3})`;
    const stripes = `repeating-linear-gradient(
        100deg,
        ${stripeColor} 0%,
        ${stripeColor} 7%,
        transparent 10%,
        transparent 12%,
        ${stripeColor} 16%
    )`;
    const rainbow = `repeating-linear-gradient(
        100deg,
        ${firstColor} 10%,
        ${secondColor} 15%,
        ${firstColor} 20%,
        ${thirdColor} 25%,
        ${firstColor} 30%
    )`;

    return (
        <section className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
            {/* Aurora background matches original hero */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `${stripes}, ${rainbow}`,
                    backgroundSize: "300%, 200%",
                    backgroundPosition: "50% 50%, 50% 50%",
                    filter: `blur(10px) opacity(${strength * 0.8}) saturate(200%)${isDark ? "" : " invert(100%)"}`,
                    maskImage: "radial-gradient(ellipse at 100% 0%, black 40%, transparent 70%)",
                    WebkitMaskImage: "radial-gradient(ellipse at 100% 0%, black 40%, transparent 70%)",
                }}
            >
                {/* Animated overlay matches original hero */}
                <div
                    className="absolute inset-0 animate-aurora-bg"
                    style={{
                        backgroundImage: `${stripes}, ${rainbow}`,
                        backgroundSize: "200%, 100%",
                        backgroundAttachment: "fixed",
                        mixBlendMode: "difference",
                    }}
                />
            </div>

            {children && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                    {children}
                </div>
            )}
            <fieldset className="pointer-events-auto absolute bottom-2 right-2 z-20 flex items-center gap-3 rounded-xl border border-white/15 bg-[var(--bg-card)]/85 px-3 py-2 text-xs text-white shadow-lg backdrop-blur-md">
                <legend className="sr-only">Animated rays appearance</legend>
                <label className="flex items-center gap-2">
                    <span>Color</span>
                    <select
                        aria-label="Rays color palette"
                        className="rounded bg-[var(--bg-card)] px-2 py-1 text-white"
                        value={palette}
                        onChange={(event) => setPalette(event.target.value)}
                    >
                        <option value="ocean">Ocean</option>
                        <option value="sunset">Sunset</option>
                        <option value="forest">Forest</option>
                    </select>
                </label>
                <label className="flex items-center gap-2">
                    <span>Intensity</span>
                    <input
                        aria-label="Rays intensity"
                        type="range"
                        min="0"
                        max="100"
                        value={intensity}
                        onChange={(event) => setIntensity(Number(event.target.value))}
                        className="w-20 accent-cyan-400"
                    />
                </label>
            </fieldset>
        </section>
    );
}

export default AnimatedRays;

