import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Sun, Moon } from "lucide-react";

const THEME_STYLES = {
  light: {
    bg: "#ECE7D6",
    bg1: "#DFD9C3",   // Warm Sage header (muted, not bright cream)
    bg2: "#D2CCA7",   // Warm Sage line color
    bg3: "#C4BC92",   // Border color
    fg: "#2C291D",
    fg2: "#3E4E35",
    fg3: "#4A4D3E",
    fg4: "#55604B",
    red: "#A33A22",
    green: "#3E4E35",
    yellow: "#B5482E",
    blue: "#51626B",
    purple: "#6E507D",
    aqua: "#5E7C66"
  },
  dark: {
    bg: "#1A1D16",
    bg1: "#24291F",
    bg2: "#141710",
    bg3: "#333C29",
    fg: "#ECE7D6",
    fg2: "#ECE7D6",
    fg3: "#98947B",
    fg4: "#98947B",
    red: "#E26345",
    green: "#7C8F6D",
    yellow: "#fabd2f",
    blue: "#48687A",
    purple: "#6E507D",
    aqua: "#8ec07c"
  }
};

function getVisitorOS() {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("linux")) return { os: "linux", icon: "🐧" };
  if (ua.includes("mac")) return { os: "macos", icon: "🍎" };
  if (ua.includes("win")) return { os: "windows", icon: "🪟" };
  if (ua.includes("android")) return { os: "android", icon: "🤖" };
  if (ua.includes("iphone") || ua.includes("ipad")) return { os: "ios", icon: "📱" };
  return { os: "unknown", icon: "💻" };
}

const rawArt = (text) => text.trim().split("\n");

const colorizeArt = (text, color) =>
  rawArt(text).map((line) => `\x1b[${color}]${line}\x1b[reset]`);

/* ── Braille Unicode Art Pool ── */
const ASCII_ART_POOL = [
  // Kali Dragon
  {
    art: colorizeArt(`
⠀⠀⠀⠀⠠⠤⠤⠤⠤⠤⣤⣤⣤⣄⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠛⠛⠿⢶⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢀⣀⣀⣠⣤⣤⣴⠶⠶⠶⠶⠶⠶⠶⠶⠶⠿⠿⢿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠚⠛⠉⠉⠉⠀⠀⠀⠀⠀⠀⢀⣀⣀⣤⡴⠶⠶⠿⠿⠿⣧⡀⠀⠀⠀⠤⢄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⣠⡴⠞⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀⢸⣿⣷⣶⣦⣤⣄⣈⡑⢦⣀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣠⠔⠚⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⡿⠟⠉⠉⠉⠉⠙⠛⠿⣿⣮⣷⣤⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⢻⣯⣧⡀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⢷⡤⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣦⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠙⠛⠛⠻⠿⠿⣿⣶⣶⣦⣄⣀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⣿⣯⡛⠻⢦⡀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⣆⠀⠙⢆⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢻⣆⠀⠈⢣
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⡆⠀⠈
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠃⠀
`, "blue"),
    label: "kali dragon",
    color: "blue",
  },
  // Coffee Cup
  {
    art: colorizeArt(`
      ⠀⠀⠀⠀⠀⠀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢀⢔⡽⠟⠛⠉⠙⠛⠻⣄⠀⣀⣤⣶⠶⣦⣄⠀⠀⠀⠀⠀⠀
⠀⣠⠷⠋⠀⠀⠀⠀⠀⠀⠀⠀⣿⣸⠁⠀⠀⠀⠈⠻⣿⡄⠀⠀⠀
⢸⣿⠃⠀⠀⠀⠀⠀⢸⡀⠀⣼⢸⣇⠀⠀⠀⠀⠀⠀⢸⣷⠀⠀⠀
⢸⣿⡀⠀⠀⠀⠀⠀⠀⠙⠋⠁⠀⠙⠛⠋⠀⠀⠀⠀⣼⡏⠀⠀⠀
⠀⢿⢷⣱⢄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣮⡿⠋⠀⠀⠀⠀
⠀⠀⠙⠽⣿⣾⣿⣤⣶⣤⣀⠀⠀⠀⡠⣪⠷⠛⠁⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠈⠉⠉⠙⣛⣿⣦⣀⣀⣿⡃⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⣤⠖⠋⠉⠀⠀⠹⣷⣿⡏⠈⠉⠓⢦⡄⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣾⡁⠀⠀⠀⠀⠀⠀⠘⡏⠓⠀⠀⠀⠀⣿⣿⠀⠀⠀⠀
⠀⠀⠀⠀⢨⣛⣦⣤⣀⣀⣀⠀⠀⢀⣀⣀⣠⡤⣾⣫⣴⠾⠿⣷⡄
⠀⠀⠀⠀⠘⣿⣿⣷⣾⣿⣿⣿⣿⣿⣿⣿⣷⢇⣿⣿⠁⠀⠀⣽⡏
⠀⠀⠀⠀⢀⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣸⣿⠇⢀⣠⡾⠋⠀
⢀⣠⡶⠚⠉⠀⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠛⠚⠉⠱⣦⣄⠀
⣾⣿⡄⠀⠀⠀⠘⢷⣭⣟⣛⣿⣿⢿⣛⣫⣵⠞⠀⠀⠀⠀⣸⡿⣷
⠙⢿⣿⣶⣤⣄⣀⠀⠀⠈⠉⠉⠉⠉⠉⠁⠀⠀⠀⠀⢠⣾⣿⡿⠀
⠀⠀⠈⠉⠛⠛⠿⠿⠿⠿⠿⣿⣿⣿⠿⠿⠿⠿⠛⠛⠛⠉⠀⠀⠀
      
`, "yellow"),
    label: "coffee mode",
    color: "yellow",
  },
  // Cinamonroll Logo
  {
    art: colorizeArt(`
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣤⡤⠤⠤⠤⣤⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡤⠞⠋⠁⠀⠀⠀⠀⠀⠀⠀⠉⠛⢦⣤⠶⠦⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⣴⠞⢋⡽⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠃⠀⠀⠙⢶⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣰⠟⠁⠀⠘⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⡀⠀⠀⠉⠓⠦⣤⣤⣤⣤⣤⣤⣄⣀⠀⠀⠀
⠀⠀⠀⠀⣠⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣷⡄⠀⠀⢻⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣆⠀
⠀⠀⣠⠞⠁⠀⠀⣀⣠⣏⡀⠀⢠⣶⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⠿⡃⠀⠀⠄⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⡆
⢀⡞⠁⠀⣠⠶⠛⠉⠉⠉⠙⢦⡸⣿⡿⠀⠀⠀⡄⢀⣀⣀⡶⠀⠀⠀⢀⡄⣀⠀⣢⠟⢦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⠃
⡞⠀⠀⠸⠁⠀⠀⠀⠀⠀⠀⠀⢳⢀⣠⠀⠀⠀⠉⠉⠀⠀⣀⠀⠀⠀⢀⣠⡴⠞⠁⠀⠀⠈⠓⠦⣄⣀⠀⠀⠀⠀⣀⣤⠞⠁⠀
⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠀⠁⠀⢀⣀⣀⡴⠋⢻⡉⠙⠾⡟⢿⣅⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠙⠛⠉⠉⠀⠀⠀⠀
⠘⣦⡀⠀⠀⠀⠀⠀⠀⣀⣤⠞⢉⣹⣯⣍⣿⠉⠟⠀⠀⣸⠳⣄⡀⠀⠀⠙⢧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠈⠙⠒⠒⠒⠒⠚⠋⠁⠀⡴⠋⢀⡀⢠⡇⠀⠀⠀⠀⠃⠀⠀⠀⠀⠀⢀⡾⠋⢻⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⢸⡀⠸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⢠⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣇⠀⠀⠉⠋⠻⣄⠀⠀⠀⠀⠀⣀⣠⣴⠞⠋⠳⠶⠞⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠳⠦⢤⠤⠶⠋⠙⠳⣆⣀⣈⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    `, "blue"),
    label: "cinamonroll mode",
    color: "blue",
  },
  // Phantom Theives
  {
    art: colorizeArt(`
      ⣶⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⣀⣤
⣧⠈⢉⠐⠻⠦⠤⣶⣠⣄⣀⣀⣠⡤⠶⠗⠚⡋⠉⣼
⣿⣇⠈⣿⣷⣿⣮⣄⠪⡍⢩⠁⢀⣤⣾⣿⣿⡇⣰⡿
⠀⢿⣦⡈⠻⣿⣿⣿⠦⠇⠀⢰⢿⣿⣿⡿⠃⣴⡿⠀
⠀⠀⠙⠻⣦⣘⣠⣄⣀⠀⡖⢁⣠⣄⣹⡴⡞⠉⠁⠀
⠀⠀⠀⠀⠈⠃⠋⠀⠙⢷⣼⠿⠋⠙⠛⠋⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀
`, "red"),
    label: "Phantom Thieves mode",
    color: "red",
  },
  // Pikawhaaa
  {
    art: colorizeArt(`
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀
⠀⣿⣿⣿⣷⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣶⣾⣿⠀
⠀⠘⢿⣿⣿⣿⣿⣦⣀⣀⣀⣄⣀⣀⣠⣀⣤⣶⣿⣿⣿⣿⣿⠇⠀
⠀⠀⠈⠻⣿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀⠀
⠀⠀⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⠋⠀⠀⠀⠀
⠀⠀⠀⢠⣿⣿⡏⠆⢹⣿⣿⣿⣿⣿⣿⠒⠈⣿⣿⣿⣇⠀⠀⠀⠀
⠀⠀⠀⣼⣿⣿⣷⣶⣿⣿⣛⣻⣿⣿⣿⣶⣾⣿⣿⣿⣿⡀⠀⠀⠀
⠀⠀⠀⡁⠀⠈⣿⣿⣿⣿⢟⣛⡻⣿⣿⣿⣟⠀⠀⠈⣿⡇⠀⠀⠀
⠀⠀⠀⢿⣶⣿⣿⣿⣿⣿⡻⣿⡿⣿⣿⣿⣿⣶⣶⣾⣿⣿⠀⠀⠀
⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⠀⠀
⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀
    `, "yellow"),
    label: "pika-confused mode",
    color: "yellow",
  },
  // Flower
  {
    art: colorizeArt(`
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠴⠂⠀⠐⠒⠤⢀⣀⢀⡤⢤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡠⠋⢀⡄⠀⠀⠀⣠⠊⠀⠀⠀⠀⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⠃⠀⡜⠀⠀⠀⢰⠁⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠃⠀⢀⠃⠀⠀⠀⡇⠀⡆⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡌⠀⠀⢸⠀⠀⠀⢠⠀⢰⢀⠀⠀⠀⠀⠘⠀⠀⡠⠐⠈⠉⠀⠀⠈⠉⠐⢤⡀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠀⣀⡀⠀⢠⡇⠀⠀⢸⠀⠀⠀⢸⠁⡜⠸⠀⠀⠀⠀⢸⡠⠊⠀⠀⠀⠀⠀⠀⢀⣀⣀⠀⠙⡄⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣔⡉⠴⠆⣠⡤⣈⠑⢺⠀⠀⠀⢈⡀⠀⠀⡘⠀⡇⡄⠀⠀⠀⠀⢸⠀⠀⠀⠀⣀⣔⠮⠝⠒⠊⠉⠛⢳⡃⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢠⠃⠀⠀⠀⠰⣏⢻⠋⠾⡆⠀⠀⠹⣌⢢⣸⣏⡆⡇⡇⠀⠀⠀⠀⡌⠀⢀⣴⡪⠋⠁⠀⢀⠤⠒⠉⡡⠄⠚⠒⣆
⠀⠀⠀⠀⠀⠀⠀⣠⠏⠒⠒⠠⢤⣀⠈⠚⢧⣄⢣⠀⢀⣀⠈⢻⡃⠘⡇⣇⠇⠀⠀⠀⢠⠃⠀⡩⠋⠀⠀⡠⠚⠁⠀⣠⠚⠢⠤⠤⠒⠁
⠀⠀⠀⢰⡲⣒⠈⠑⠒⠂⠤⠄⢠⠤⣍⠒⠤⡙⢿⣆⠘⡌⠉⣷⢻⡀⣿⠸⠁⠀⠀⠀⡌⢀⠞⠀⠀⢀⠎⠀⠀⢀⠞⠁⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠉⠒⠷⢆⠀⠀⠀⠀⠀⠓⠶⠵⢤⣈⡑⠝⢷⣽⡄⢿⣟⣷⢻⠀⠀⠀⡠⠎⣀⠬⠤⠤⢄⡀⠀⢀⡴⠃⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠑⣤⡠⠔⠒⣒⣀⡒⠒⢏⣻⣷⣦⣽⣿⣎⢿⡝⣿⣧⠀⡜⡵⠋⠀⠀⠀⠀⠀⠈⠙⢍⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⠤⠒⢉⡡⠔⠚⠉⠁⠀⠀⠀⠈⠉⠙⠀⠉⠛⠿⣿⣧⣿⣜⣿⣦⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢧⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢀⠖⠁⣠⠔⠉⠀⠀⠀⠀⡠⠄⠐⣒⡤⠬⠭⠉⠉⠤⠴⠮⣿⣿⣿⣿⡿⣇⣤⣄⣀⣀⠀⠀⠠⠤⠄⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⡰⠁⢀⠖⠁⠀⠀⠀⠀⢀⡠⠔⠊⠉⠀⠀⠀⢀⣀⠤⠐⠒⠂⢰⠏⠓⠓⢻⢻⠋⠥⣒⠤⣉⠁⠒⠤⣀⠀⠀⢣⡀⠀⠀⠀⠀⠀⠀⠀
⢀⠇⣠⠇⠀⠀⠀⠀⡠⠞⠁⠀⠀⠀⣀⠤⠖⠈⠁⠀⠀⠀⠀⠀⡀⠀⠀⠀⠘⡆⢣⠀⠀⠑⢦⡑⠦⡀⠀⠁⠀⠀⠳⡄⠀⠀⠀⠀⠀⠀
⠸⣰⠁⠀⠀⢀⡴⠋⠀⠀⠀⡠⠔⠋⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠻⡀⠀⠀⠀⢱⠀⠱⡀⠀⠀⠘⢦⡈⠢⡀⠀⠀⠀⠘⣆⠀⠀⠀⠀⠀
⠀⢇⠀⠀⡠⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⡴⠋⠀⢠⣷⠤⣀⡀⠀⢣⣀⡈⠢⡀⠀⠀⠙⠢⣈⠓⢄⠀⠀⠘⡀⠀⠀⠀⠀
⠀⠸⠀⡰⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⡤⢲⡾⠋⡘⠀⠀⢀⢷⠁⠀⠀⢸⠉⠁⠀⠉⠉⠐⠢⢄⠀⠀⠈⠑⠢⠭⠂⢠⠇⠀⠀⠀⠀
⠀⢰⢾⣡⠞⠉⠉⠉⠉⠉⠉⠉⠉⠀⠀⡌⠀⠾⠁⢠⠁⠀⠀⡜⡆⠀⠀⢀⠇⠀⠀⠀⠀⠀⠀⠀⠀⠉⠒⠤⣀⡀⠀⣀⣸⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡀⢸⡇⠀⢸⠀⠀⠀⡇⡇⠀⢀⠎⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⠁⠈⠀⠀⢸⠀⠀⠀⡇⠇⠀⡌⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡄⠀⠄⠀⠘⡀⠀⠀⡇⠀⢰⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠱⡄⠀⠀⠀⢣⡀⠀⠸⠀⡟⠓⢦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠢⣀⠀⠀⠑⠂⣀⣃⢳⡀⡼⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠒⠒⠋⠁⠀⠙⠽⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
`, "purple"),
    label: "flower power",
    color: "purple",
  },
];

function getRandomArt() {
  return ASCII_ART_POOL[Math.floor(Math.random() * ASCII_ART_POOL.length)];
}

/* ── Combined Neofetch lines builder ── */
function buildNeofetchLines(visitorOS, asciiChoice) {
  const result = [];
  result.push("");
  asciiChoice.art.forEach(line => result.push("  " + line));
  result.push("");
  result.push(`  \x1b[green]lixeron\x1b[fg4]@\x1b[blue]fedora\x1b[reset]`);
  result.push(`  \x1b[green]---------------\x1b[reset]`);
  result.push(`  \x1b[green]OS:\x1b[reset] Fedora Workstation 43`);
  result.push(`  \x1b[green]Host:\x1b[reset] Ethan Tran`);
  result.push(`  \x1b[green]Role:\x1b[reset] CS Senior`);
  result.push(`  \x1b[green]Shell:\x1b[reset] bash 5.2`);
  result.push(`  \x1b[green]Stack:\x1b[reset] Python, Bash, Git`);
  result.push(`  \x1b[green]Uptime:\x1b[reset] 21 years`);
  result.push(`  \x1b[green]Status:\x1b[reset] Looking for internships`);
  result.push(``);
  result.push(`  \x1b[fg4]${visitorOS.icon} you're on \x1b[aqua]${visitorOS.os}\x1b[fg4]. nice.\x1b[reset]`);
  result.push(`  \x1b[fg4]theme: \x1b[${asciiChoice.color}]${asciiChoice.label}\x1b[reset]`);
  return result;
}

const FILES = {
  "about.txt": `
  Name:     Ethan Tran
  School:   University of Alabama at Birmingham
  Major:    B.A. Computer Science (Minor: Social Psych & Info Systems)
  Grad:     Accelerated M.S. Cybersecurity Track
  Honors:   Honors College, Tri-Alpha Honor Society
  Interests: DevOps, Cloud Infrastructure, Cybersecurity
  Learning: GoLang, AWS, Docker, Azure
  Fun Fact: When not in the terminal, I'm perfecting
            from-scratch Pho or baking sourdough.
`,
  "contact.txt": `
  Email:    etran0155@gmail.com
  GitHub:   github.com/lixeron
  Phone:    334-589-0824
`,
};

const PROJECTS_LIST = `
  \x1b[green]dead_route/\x1b[reset]      Zombie survival roguelite — Python, Docker, CI/CD
  \x1b[green]see_gpt/\x1b[reset]         Phishing simulation engine — Flask, OpenAI, Chart.js
  \x1b[green]arto/\x1b[reset]            Spam call blocker — Android, Kotlin, Supabase, AI
  \x1b[green]honeypot/\x1b[reset]        Azure Cloud SOC lab — Sentinel, KQL, Powershell
  \x1b[green]traffic_drone/\x1b[reset]   YOLOv8 vehicle detection — Python, DJI Tello SDK
  \x1b[green]wireshark_ctf/\x1b[reset]   ICMP packet CTF challenge — Python, Networking
`;

function parseTerminalText(text, colors) {
  const parts = [];
  const regex = /\x1b\[(\w+)\]/g;
  let lastIndex = 0;
  let currentColor = colors.fg;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push({ text: text.slice(lastIndex, match.index), color: currentColor });
    const code = match[1];
    if (code === "reset") currentColor = colors.fg;
    else if (colors[code]) currentColor = colors[code];
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push({ text: text.slice(lastIndex), color: currentColor });
  return parts;
}

const TERM_FONT = { fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: "clamp(9px, 1.4vw, 14px)", lineHeight: "1.5em" };

function TerminalLine({ text, colors }) {
  const parts = parseTerminalText(text, colors);
  return (
    <div style={{ minHeight: "1.5em", whiteSpace: "pre", ...TERM_FONT }}>
      {parts.map((p, i) => <span key={i} style={{ color: p.color }}>{p.text}</span>)}
    </div>
  );
}

// Fullscreen Btop dashboard
function BtopDashboard({ onExit, colors }) {
  const [cpuUsage, setCpuUsage] = useState(35);
  const [ramUsage, setRamUsage] = useState(52);
  const [seconds, setSeconds] = useState(0);
  const [chart, setChart] = useState(Array(30).fill(2));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "q" || e.key === "Q" || e.key === "Escape") {
        onExit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onExit]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(s => s + 1);
      const newCpu = Math.floor(15 + Math.random() * 50);
      setCpuUsage(newCpu);
      setRamUsage(r => Math.max(45, Math.min(85, r + (Math.random() - 0.5) * 1.5)));
      setChart(prev => {
        const next = [...prev.slice(1)];
        next.push(Math.floor((newCpu / 100) * 10));
        return next;
      });
    }, 400);
    return () => clearInterval(timer);
  }, []);

  const getChartLine = (row) => {
    let line = "";
    for (let col = 0; col < chart.length; col++) {
      if (chart[col] >= row) line += "█";
      else if (chart[col] + 1 >= row) line += "▄";
      else line += " ";
    }
    return line;
  };

  const drawProgressBar = (val, max = 20) => {
    const filled = Math.floor((val / 100) * max);
    return "[" + "█".repeat(filled) + "░".repeat(max - filled) + "]";
  };

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      backgroundColor: "transparent",
      color: colors.fg,
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      ...TERM_FONT,
      zIndex: 10,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${colors.bg3}`, paddingBottom: "6px", marginBottom: "12px" }}>
        <span style={{ color: colors.green }}>btop++ v1.2.1 (Riced CLI)</span>
        <span style={{ color: colors.yellow }}>Uptime: {Math.floor(seconds / 60)}m {seconds % 60}s</span>
        <span style={{ color: colors.purple }}>Press [Q] or [ESC] to Exit</span>
      </div>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "16px", minHeight: 0 }}>
        <div style={{ border: `1px solid ${colors.bg3}`, borderRadius: "4px", padding: "12px", display: "flex", flexDirection: "column" }}>
          <div style={{ color: colors.blue, fontWeight: 700, marginBottom: "8px" }}>CPU Load ({cpuUsage}%)</div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", color: colors.green, lineSpacing: 0, marginBottom: "8px" }}>
            {[9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map(row => (
              <div key={row} style={{ display: "flex", height: "1.2em", alignItems: "center" }}>
                <span style={{ color: colors.fg4, width: "30px", fontSize: "11px" }}>{row * 10}% </span>
                <span style={{ whiteSpace: "pre" }}>{getChartLine(row)}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
            <div>Core 0: {drawProgressBar(cpuUsage - 4, 10)} {Math.max(0, cpuUsage - 4)}%</div>
            <div>Core 1: {drawProgressBar(cpuUsage + 2, 10)} {Math.min(100, cpuUsage + 2)}%</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ border: `1px solid ${colors.bg3}`, borderRadius: "4px", padding: "12px" }}>
            <div style={{ color: colors.purple, fontWeight: 700, marginBottom: "8px" }}>Memory Allocation</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span>RAM</span>
              <span>{drawProgressBar(ramUsage, 15)} {Math.round(ramUsage * 0.16)}G / 16G</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>DISK</span>
              <span>{drawProgressBar(45, 15)} 230G / 512G</span>
            </div>
          </div>
          <div style={{ border: `1px solid ${colors.bg3}`, borderRadius: "4px", padding: "12px", flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div style={{ color: colors.yellow, fontWeight: 700, marginBottom: "8px" }}>Active Riced Daemons</div>
            <div style={{ fontSize: "12px", overflow: "hidden" }}>
              <div>PID 1402 [caffeine-daemon] CPU: {Math.floor(cpuUsage * 0.2)}% MEM: 5%</div>
              <div>PID 2045 [pho-sim-engine] CPU: {Math.floor(cpuUsage * 0.1)}% MEM: 12%</div>
              <div>PID 9024 [hyprland-wm-rice] CPU: {Math.floor(cpuUsage * 0.15)}% MEM: 10%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const COMMANDS = ["help", "ls", "cat", "neofetch", "btop", "htop", "clear", "./portfolio.sh"];
const FILES_LIST = ["about.txt", "contact.txt"];

export default function Terminal({ onLaunchPortfolio, theme, onToggleTheme }) {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [typingNeofetch, setTypingNeofetch] = useState(true);
  const [isBtop, setIsBtop] = useState(false);

  // Tab completion option rotation states
  const [tabMatches, setTabMatches] = useState([]);
  const [tabIndex, setTabIndex] = useState(-1);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const termRef = useRef(null);
  const inputRef = useRef(null);

  const colors = useMemo(() => THEME_STYLES[theme], [theme]);
  const visitorOS = useMemo(() => getVisitorOS(), []);
  const asciiChoice = useMemo(() => getRandomArt(), []);
  const neofetchLines = useMemo(() => buildNeofetchLines(visitorOS, asciiChoice), [visitorOS, asciiChoice]);

  // Inline grey suggestion (Zsh style)
  const suggestion = useMemo(() => {
    const trimmed = input.trim();
    if (trimmed === "") return "";
    
    const parts = input.split(/\s+/);
    if (parts.length > 1 && parts[0].toLowerCase() === "cat") {
      const prefix = parts.slice(1).join(" ").toLowerCase();
      const match = FILES_LIST.find(f => f.startsWith(prefix));
      if (match && match !== prefix) {
        return match.slice(prefix.length);
      }
      return "";
    }
    
    if (parts.length === 1) {
      const match = COMMANDS.find(cmd => cmd.startsWith(trimmed.toLowerCase()));
      if (match && match !== trimmed.toLowerCase()) {
        return match.slice(trimmed.length);
      }
    }
    
    return "";
  }, [input]);

  useEffect(() => { const id = setInterval(() => setShowCursor(c => !c), 530); return () => clearInterval(id); }, []);

  useEffect(() => {
    let i = 0; const initial = [];
    const id = setInterval(() => {
      if (i < neofetchLines.length) { initial.push(neofetchLines[i]); setLines([...initial]); i++; }
      else { initial.push(""); initial.push("  \x1b[fg4]Type \x1b[green]help\x1b[fg4] for commands, or try \x1b[green]ls\x1b[fg4] to look around.\x1b[reset]"); initial.push(""); setLines([...initial]); setTypingNeofetch(false); clearInterval(id); }
    }, 50);
    return () => clearInterval(id);
  }, [neofetchLines]);

  useEffect(() => { if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight; }, [lines]);

  const addLines = useCallback(nl => setLines(p => [...p, ...nl]), []);

  const handleInputChange = (val) => {
    setInput(val);
    setTabMatches([]);
    setTabIndex(-1);
  };

  const handleCommand = useCallback(cmd => {
    const trimmed = cmd.trim().toLowerCase();
    const prompt = `  \x1b[green]lixeron\x1b[fg4]@\x1b[blue]fedora\x1b[reset]:\x1b[yellow]~\x1b[reset]$ ${cmd}`;
    const nl = [prompt];
    
    const args = trimmed.split(/\s+/);
    const mainCommand = args[0];

    switch (mainCommand) {
      case "ls": 
        if (args[1] === "projects" || args[1] === "projects/") {
          PROJECTS_LIST.split("\n").forEach(l => nl.push(l));
        } else {
          nl.push("  \x1b[green]about.txt\x1b[reset]    \x1b[green]projects/\x1b[reset]    \x1b[green]contact.txt\x1b[reset]    \x1b[yellow]portfolio.sh\x1b[reset]");
        }
        break;
      case "help":
        nl.push("  \x1b[yellow]Available commands:\x1b[reset]");
        nl.push("    \x1b[green]ls\x1b[reset]                  List files");
        nl.push("    \x1b[green]cat about.txt\x1b[reset]       Who am I");
        nl.push("    \x1b[green]cat contact.txt\x1b[reset]     How to reach me");
        nl.push("    \x1b[green]ls projects\x1b[reset]         View my projects");
        nl.push("    \x1b[green]btop\x1b[reset] / \x1b[green]htop\x1b[reset]        Launch system resource monitor");
        nl.push("    \x1b[green]./portfolio.sh\x1b[reset]      Launch the portfolio");
        nl.push("    \x1b[green]clear\x1b[reset]               Clear terminal");
        nl.push("    \x1b[green]neofetch\x1b[reset]            Show system info"); break;
      case "cat":
        const fileArg = args.slice(1).join(" ");
        if (fileArg === "about.txt") {
          FILES["about.txt"].split("\n").forEach(l => nl.push(l));
        } else if (fileArg === "contact.txt") {
          FILES["contact.txt"].split("\n").forEach(l => nl.push(l));
        } else if (!fileArg) {
          nl.push("  cat: missing file operand");
        } else {
          nl.push(`  cat: ${fileArg}: No such file or directory`);
        }
        break;
      case "btop":
      case "htop":
        setIsBtop(true);
        return;
      case "./portfolio.sh": 
        nl.push("  \x1b[green]▶ Launching portfolio...\x1b[reset]"); 
        addLines(nl); 
        setTimeout(() => {
          onLaunchPortfolio();
        }, 500); 
        return;
      case "clear": setLines([]); return;
      case "neofetch": neofetchLines.forEach(l => nl.push(l)); break;
      case "sudo": 
        if (args[1] === "rm" && trimmed.includes("-rf")) {
          nl.push("  \x1b[red]Nice try.\x1b[reset]");
        } else {
          nl.push("  sudo: permission denied");
        }
        break;
      case "whoami": nl.push("  \x1b[green]lixeron\x1b[reset]"); break;
      case "pwd": nl.push("  /home/lixeron"); break;
      case "date": nl.push(`  ${new Date().toString()}`); break;
      case "uname": nl.push("  Linux fedora 6.8.0 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux"); break;
      case "": break;
      default: nl.push(`  \x1b[red]bash: ${mainCommand}: command not found\x1b[reset]`); nl.push(`  \x1b[fg4]Type \x1b[green]help\x1b[fg4] for available commands.\x1b[reset]`);
    }
    addLines(nl);
  }, [addLines, neofetchLines, onLaunchPortfolio]);

  const handleKeyDown = useCallback(e => {
    if (typingNeofetch) return;
    
    if (e.key === "Enter") {
      handleCommand(input);
      setInput("");
      setTabMatches([]);
      setTabIndex(-1);
    } else if (e.key === "Tab") {
      e.preventDefault();
      
      let currentMatches = tabMatches;
      let currentIndex = tabIndex;

      if (currentMatches.length === 0) {
        const parts = input.split(/\s+/);
        
        if (parts.length > 1 && parts[0].toLowerCase() === "cat") {
          const prefix = parts.slice(1).join(" ").toLowerCase();
          const matches = FILES_LIST.filter(f => f.startsWith(prefix));
          if (matches.length > 0) {
            currentMatches = matches.map(f => `cat ${f}`);
          }
        } else if (input.endsWith(" ") && parts[0].toLowerCase() === "cat") {
          currentMatches = FILES_LIST.map(f => `cat ${f}`);
        } else {
          const prefix = input.toLowerCase();
          currentMatches = COMMANDS.filter(cmd => cmd.startsWith(prefix));
        }

        if (currentMatches.length > 0) {
          setTabMatches(currentMatches);
          currentIndex = 0;
          setTabIndex(0);
          setInput(currentMatches[0]);
        }
      } else {
        currentIndex = (currentIndex + 1) % currentMatches.length;
        setTabIndex(currentIndex);
        setInput(currentMatches[currentIndex]);
      }
    } else if (e.key === "ArrowRight") {
      if (suggestion) {
        e.preventDefault();
        
        const parts = input.split(/\s+/);
        if (parts.length > 1 && parts[0].toLowerCase() === "cat") {
          const prefix = parts.slice(1).join(" ").toLowerCase();
          setInput("cat " + prefix + suggestion);
        } else {
          setInput(input + suggestion);
        }
        
        setTabMatches([]);
        setTabIndex(-1);
      }
    }
  }, [input, handleCommand, typingNeofetch, suggestion, tabMatches, tabIndex]);

  const exitBtop = useCallback(() => {
    setIsBtop(false);
    addLines([
      `  \x1b[green]lixeron\x1b[fg4]@\x1b[blue]fedora\x1b[reset]:\x1b[yellow]~\x1b[reset]$ btop`,
      `  btop: session terminated.`
    ]);
  }, [addLines]);

  return (
    <div 
      onClick={() => inputRef.current?.focus()} 
      style={{ 
        height: "100vh", 
        background: "transparent", // Transparent to reveal watercolor shader behind
        color: colors.fg,
        display: "flex", 
        flexDirection: "column", 
        cursor: "default", // High-contrast arrow pointer instead of thin text stick
        position: "relative", 
        overflow: "hidden",
        transition: "color 0.3s ease"
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.02) 3px,rgba(0,0,0,.02) 4px)`, pointerEvents: "none", zIndex: 1 }} />
      
      {/* Dynamic Header ribbon matching current theme */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 8, 
        padding: "10px 16px", 
        background: `${colors.bg1}ee`, 
        borderBottom: `1px solid ${colors.bg2}`, 
        position: "relative", 
        zIndex: 2, 
        flexShrink: 0,
        transition: "background-color 0.3s ease, border-color 0.3s ease"
      }}>
        {/* Decorative dots */}
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: colors.red }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: colors.yellow }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: colors.green }} />
        </div>
        
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: colors.fg4, marginLeft: 12 }}>lixeron@fedora: ~</span>
        <div style={{ flex: 1 }} />

        {/* Dynamic Theme Toggle in Terminal Header */}
        <button
          onClick={e => { e.stopPropagation(); onToggleTheme(); }}
          style={{
            background: "transparent",
            border: `1px solid ${colors.bg3}`,
            color: colors.fg4,
            padding: "4px 10px",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            marginRight: "8px"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = colors.green;
            e.currentTarget.style.color = colors.green;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = colors.bg3;
            e.currentTarget.style.color = colors.fg4;
          }}
        >
          {theme === "light" ? <Moon size={12} /> : <Sun size={12} />}
        </button>

        <button onClick={e => { e.stopPropagation(); handleCommand("./portfolio.sh"); }}
          style={{ 
            fontFamily: "'JetBrains Mono', monospace", 
            fontSize: 11, 
            color: colors.fg4, 
            background: colors.bg2, 
            border: `1px solid ${colors.bg3}`, 
            padding: "4px 12px", 
            borderRadius: 4, 
            cursor: "pointer", 
            transition: "all 0.2s" 
          }}
          onMouseEnter={e => { e.target.style.color = colors.green; e.target.style.borderColor = colors.green; }}
          onMouseLeave={e => { e.target.style.color = colors.fg4; e.target.style.borderColor = colors.bg3; }}>skip → portfolio</button>
      </div>

      {isBtop ? (
        <BtopDashboard onExit={exitBtop} colors={colors} />
      ) : (
        <div ref={termRef} style={{ flex: 1, padding: "12px 16px", overflowY: "auto", position: "relative", zIndex: 2 }}>
          {lines.map((line, i) => <TerminalLine key={i} text={line} colors={colors} />)}
          {!typingNeofetch && (
            <div style={{ display: "flex", alignItems: "center", minHeight: "1.5em", whiteSpace: "pre", ...TERM_FONT }}>
              <span style={{ color: colors.green }}>  lixeron</span>
              <span style={{ color: colors.fg4 }}>@</span>
              <span style={{ color: colors.blue }}>fedora</span>
              <span style={{ color: colors.fg }}>:</span>
              <span style={{ color: colors.yellow }}>~</span>
              <span style={{ color: colors.fg }}>$ </span>
              <span style={{ color: colors.fg }}>{input}</span>
              {suggestion && <span style={{ color: colors.fg4, opacity: 0.65 }}>{suggestion}</span>}
              <span style={{ display: "inline-block", width: "0.55em", height: "1.10em", background: showCursor ? colors.fg : "transparent", marginLeft: 1, verticalAlign: "middle", transition: "background 0.1s" }} />
            </div>
          )}
        </div>
      )}

      {isMobile && !typingNeofetch && !isBtop && (
        <div style={{
          display: "flex",
          gap: "12px",
          padding: "10px 16px",
          background: `${colors.bg1}dd`,
          borderTop: `1px solid ${colors.bg2}`,
          zIndex: 10,
          position: "relative",
          flexShrink: 0,
          justifyContent: "space-around"
        }}>
          <button
            onClick={(e) => { e.stopPropagation(); handleKeyDown({ preventDefault: () => {}, key: "Tab" }); }}
            style={{
              flex: 1,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px",
              color: colors.fg,
              background: colors.bg2,
              border: `1px solid ${colors.bg3}`,
              padding: "8px 0",
               borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            [ TAB ]
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleCommand(input); setInput(""); }}
            style={{
              flex: 1,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px",
              color: colors.green,
              background: colors.bg2,
              border: `1px solid ${colors.bg3}`,
              padding: "8px 0",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            [ ENTER ]
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleCommand("./portfolio.sh"); }}
            style={{
              flex: 1,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px",
              color: colors.red,
              background: colors.bg2,
              border: `1px solid ${colors.bg3}`,
              padding: "8px 0",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            [ SKIP ]
          </button>
        </div>
      )}

      <input ref={inputRef} autoFocus value={input} onChange={e => handleInputChange(e.target.value)} onKeyDown={handleKeyDown} aria-hidden="true" tabIndex={-1}
        style={{ position: "fixed", top: -9999, left: -9999, width: 1, height: 1, padding: 0, margin: 0, border: "none", outline: "none", background: "transparent", color: "transparent", caretColor: "transparent", opacity: 0, fontSize: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }} />
    </div>
  );
}
