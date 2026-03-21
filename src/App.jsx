import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const GRUVBOX = {
  bg: "#282828",
  bg0_h: "#1d2021",
  bg1: "#3c3836",
  bg2: "#504945",
  bg3: "#665c54",
  fg: "#ebdbb2",
  fg2: "#d5c4a1",
  fg3: "#bdae93",
  fg4: "#a89984",
  red: "#fb4934",
  green: "#b8bb26",
  yellow: "#fabd2f",
  blue: "#83a598",
  purple: "#d3869b",
  aqua: "#8ec07c",
  orange: "#fe8019",
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

/* ── Hollywood Background ── */
function HollywoodBG({ opacity = 0.5 }) {
  const canvasRef = useRef(null);
  const columnsRef = useRef([]);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*(){}[]|;:<>,.?/~`±§アイウエオカキクケコサシスセソ";
    const fontSize = 14;
    let columns = 0;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      while (columnsRef.current.length < columns) {
        columnsRef.current.push(Math.random() * -100);
      }
    }

    resize();
    window.addEventListener("resize", resize);
    let lastTime = 0;

    function draw(timestamp) {
      if (timestamp - lastTime < 70) { animRef.current = requestAnimationFrame(draw); return; }
      lastTime = timestamp;
      ctx.fillStyle = "rgba(29, 32, 33, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;
      for (let i = 0; i < columns; i++) {
        if (Math.random() > 0.3) continue;
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = columnsRef.current[i] * fontSize;
        ctx.fillStyle = `rgba(184, 187, 38, ${(Math.random() * 0.4 + 0.1) * 0.12})`;
        ctx.fillText(char, x, y);
        if (Math.random() > 0.97) { ctx.fillStyle = `rgba(184, 187, 38, 0.25)`; ctx.fillText(char, x, y); }
        if (y > canvas.height && Math.random() > 0.975) columnsRef.current[i] = 0;
        columnsRef.current[i] += 0.5 + Math.random() * 0.5;
      }
      animRef.current = requestAnimationFrame(draw);
    }
    animRef.current = requestAnimationFrame(draw);
    return () => { window.removeEventListener("resize", resize); if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none", opacity }} />;
}

function GitHubIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

/* ── Scroll Reveal ── */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(el); } }, { threshold });
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, isVisible];
}

function Reveal({ children, delay = 0, direction = "up" }) {
  const [ref, isVisible] = useScrollReveal(0.1);
  const transforms = { up: "translateY(40px)", down: "translateY(-40px)", left: "translateX(40px)", right: "translateX(-40px)", none: "translateY(0)" };
  return (
    <div ref={ref} style={{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translate(0, 0)" : transforms[direction],
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>{children}</div>
  );
}

/* ── Hero Typing Cursor ── */
function HeroCursor() {
  const [visible, setVisible] = useState(true);
  useEffect(() => { const id = setInterval(() => setVisible(v => !v), 600); return () => clearInterval(id); }, []);
  return <span style={{ display: "inline-block", width: 3, height: "0.9em", background: visible ? GRUVBOX.green : "transparent", marginLeft: 4, verticalAlign: "baseline", transition: "background 0.1s" }} />;
}

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { background: ${GRUVBOX.bg}; }
  ::selection { background: ${GRUVBOX.green}40; color: ${GRUVBOX.fg}; }
  ::-webkit-scrollbar { display: none; }
  * { -ms-overflow-style: none; scrollbar-width: none; }
  @keyframes ambientGlow {
    0%, 100% { opacity: 0.15; transform: scale(1); }
    50% { opacity: 0.25; transform: scale(1.05); }
  }
`;

/* ── Neofetch builder — art on top, info below ── */
function buildNeofetchLines(visitorOS, asciiChoice) {
  const result = [];
  result.push("");
  asciiChoice.art.forEach(line => result.push("  " + line));
  result.push("");
  result.push(`  \x1b[green]lixeron\x1b[fg4]@\x1b[blue]fedora\x1b[reset]`);
  result.push(`  \x1b[green]---------------\x1b[reset]`);
  result.push(`  \x1b[green]OS:\x1b[reset] Fedora Workstation 43`);
  result.push(`  \x1b[green]Host:\x1b[reset] Ethan Tran`);
  result.push(`  \x1b[green]Role:\x1b[reset] CS Junior`);
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

function parseTerminalText(text) {
  const parts = []; const regex = /\x1b\[(\w+)\]/g; let lastIndex = 0; let currentColor = GRUVBOX.fg; let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push({ text: text.slice(lastIndex, match.index), color: currentColor });
    const code = match[1]; if (code === "reset") currentColor = GRUVBOX.fg; else if (GRUVBOX[code]) currentColor = GRUVBOX[code]; lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push({ text: text.slice(lastIndex), color: currentColor });
  return parts;
}

const TERM_FONT = { fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 14, lineHeight: "1.5em" };

function TerminalLine({ text }) {
  const parts = parseTerminalText(text);
  return (
    <div style={{ minHeight: "1.5em", whiteSpace: "pre", ...TERM_FONT }}>
      {parts.map((p, i) => <span key={i} style={{ color: p.color }}>{p.text}</span>)}
    </div>
  );
}

function ProjectPreview({ color, image }) {
  const [hovered, setHovered] = useState(false);
  if (image) {
    return (
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{ width: "100%", height: 180, borderRadius: "8px 8px 0 0", overflow: "hidden", position: "relative", borderBottom: `1px solid ${GRUVBOX.bg2}` }}>
        <img src={image} alt="project preview" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease", transform: hovered ? "scale(1.05)" : "scale(1)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${GRUVBOX.bg0_h}90 0%, transparent 40%)`, pointerEvents: "none" }} />
      </div>
    );
  }
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ width: "100%", height: 160, background: `linear-gradient(135deg, ${GRUVBOX.bg0_h} 0%, ${color}08 100%)`, borderRadius: "8px 8px 0 0", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", borderBottom: `1px solid ${GRUVBOX.bg2}` }}>
      <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${color}04 2px, ${color}04 4px)`, pointerEvents: "none" }} />
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `${color}90`, textAlign: "center", padding: 16, transition: "all 0.3s", transform: hovered ? "scale(1.05)" : "scale(1)" }}>
        <div style={{ width: 48, height: 48, borderRadius: 10, border: `2px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontSize: 20, background: `${color}10`, transition: "all 0.3s", borderColor: hovered ? `${color}80` : `${color}40` }}>▶</div>
        <span style={{ opacity: 0.7 }}>preview coming soon</span>
      </div>
    </div>
  );
}

const PROJECTS_DATA = [
  { name: "Dead Route", desc: "A zombie survival roguelite where every choice scars you — literally. 19 interconnected game systems, 13 unique NPCs, CI/CD pipeline, Docker support, and a full test suite.", tech: ["Python", "Docker", "GitHub Actions", "SQLite", "Make"], link: "https://github.com/lixeron/Dead_Route", color: GRUVBOX.red, image: null },
  { name: "Azure Cloud Honeypot & SOC Lab", desc: "Deployed a vulnerable Windows VM honeypot in Azure to attract real-world attacks. Built KQL queries for geolocation analysis and visualized global attack patterns via Workbooks.", tech: ["Azure", "Sentinel", "KQL", "PowerShell", "Log Analytics"], link: "#", color: GRUVBOX.blue, image: null },
  { name: "SEE-GPT", desc: "A phishing simulation platform that uses GPT to auto-generate realistic social engineering emails, tracks user responses, and provides real-time AI-powered security awareness feedback.", tech: ["Python", "Flask", "OpenAI API", "Chart.js", "SMTP"], link: "https://github.com/lixeron/SEE_GPT", color: GRUVBOX.orange, image: null },
  { name: "ARTO — Spam Call Blocker", desc: "Android app that detects and blocks scam calls/SMS using cloud-based AI analysis. Features a privacy-first pipeline with local PII sanitization and zero data retention.", tech: ["Kotlin", "Android", "Supabase", "Claude AI"], link: "https://github.com/SoleP12/Stark-Industries-CS-420", color: GRUVBOX.green, image: null },
  { name: "Traffic Drone SE Project", desc: "Integrated Python with DJI Tello hardware for real-time vehicle detection using YOLOv8. Built a live GUI dashboard for system diagnostics and traffic analytics.", tech: ["Python", "YOLOv8", "Tello SDK", "OpenCV"], link: "#", color: GRUVBOX.yellow, image: null },
  { name: "Wireshark CTF Challenge", desc: "Custom CTF that fragments a secret flag into ICMP packets mixed with noise traffic. Players must filter, analyze hex-encoded data, and decode through Base64.", tech: ["Python", "Wireshark", "Networking", "ICMP"], link: "https://github.com/lixeron/Wireshark-CTF-Beginner-Challenge", color: GRUVBOX.purple, image: null },
];

const EXPERIENCE_DATA = [
  { role: "Desktop Support – Student Assistant", company: "UAB IT", date: "Dec 2025 – Present", points: ["Image Windows/macOS machines, manage data migration, backups, and full system updates", "Harden systems via BIOS/UEFI, stage workstations for AD integration, observe PKI workflows", "Resolve tickets in ServiceNow, assign static IPs, deploy applications via Software Center"] },
  { role: "ARLA Intern", company: "UAB – UABTeach", date: "Jan 2024 – May 2025", points: ["Tutored students in mathematics and CS concepts", "Assisted with classroom technology and troubleshooting", "Developed documentation habits for reporting student progress"] },
];

/* ═══════ PORTFOLIO ═══════ */
function Portfolio({ onBack }) {
  const [activeSection, setActiveSection] = useState("projects");
  const [hoveredProject, setHoveredProject] = useState(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);
  const sections = ["projects", "experience", "skills", "contact"];

  // Scroll spy — update active nav tab based on which section is in view
  useEffect(() => {
    const observers = [];
    const handleIntersect = (id) => (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveSection(id);
      });
    };
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(handleIntersect(id), {
        rootMargin: "-40% 0px -55% 0px", // triggers when section is roughly in the middle of viewport
        threshold: 0,
      });
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(170deg, ${GRUVBOX.bg0_h}f0 0%, ${GRUVBOX.bg}f0 40%, #1a1a1af0 100%)`, color: GRUVBOX.fg, fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", opacity: visible ? 1 : 0, transition: "opacity 0.8s ease", position: "relative", zIndex: 1 }}>
      <style>{GLOBAL_CSS}</style>
      <HollywoodBG opacity={0.25} />

      {/* Nav */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: `${GRUVBOX.bg0_h}ee`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${GRUVBOX.bg2}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: GRUVBOX.green, fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 700, letterSpacing: "-0.5px" }}>~/ethan</span>
            <span style={{ color: GRUVBOX.fg4, fontSize: 13 }}>v1.0</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {sections.map(s => (
              <button key={s} onClick={() => { setActiveSection(s); document.getElementById(s)?.scrollIntoView({ behavior: "smooth" }); }}
                style={{ background: activeSection === s ? GRUVBOX.bg2 : "transparent", color: activeSection === s ? GRUVBOX.green : GRUVBOX.fg4, border: "none", padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, transition: "all 0.2s" }}>{s}</button>
            ))}
            <button onClick={onBack} style={{ background: "transparent", color: GRUVBOX.fg4, border: `1px solid ${GRUVBOX.bg3}`, padding: "8px 14px", borderRadius: 6, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, marginLeft: 8, transition: "all 0.2s" }}
              onMouseEnter={e => { e.target.style.borderColor = GRUVBOX.green; e.target.style.color = GRUVBOX.green; }}
              onMouseLeave={e => { e.target.style.borderColor = GRUVBOX.bg3; e.target.style.color = GRUVBOX.fg4; }}>← terminal</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", position: "relative", zIndex: 1 }}>
        {/* Hero */}
        <Reveal delay={0.1}>
          <div style={{ paddingTop: 140, paddingBottom: 80, position: "relative" }}>
            {/* Ambient glow behind hero */}
            <div style={{
              position: "absolute", top: 100, left: -100, width: 400, height: 400,
              borderRadius: "50%", background: `radial-gradient(circle, ${GRUVBOX.green}15 0%, transparent 70%)`,
              animation: "ambientGlow 6s ease-in-out infinite", pointerEvents: "none", filter: "blur(60px)",
            }} />
            <div style={{ position: "relative" }}>
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", color: GRUVBOX.green, fontSize: 14, background: `${GRUVBOX.green}15`, padding: "4px 12px", borderRadius: 20 }}>open to internships</span>
              </div>
              <h1 style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 800, lineHeight: 1.05, margin: "16px 0", letterSpacing: "-2px", background: `linear-gradient(135deg, ${GRUVBOX.fg} 0%, ${GRUVBOX.fg3} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline" }}>Ethan Tran</h1>
              <HeroCursor />
              <p style={{ fontSize: "clamp(18px, 2.5vw, 24px)", color: GRUVBOX.fg4, maxWidth: 620, lineHeight: 1.5, margin: "16px 0 0 0" }}>
                CS Junior at UAB exploring <span style={{ color: GRUVBOX.aqua }}>DevOps</span>,{" "}
                <span style={{ color: GRUVBOX.blue }}>Cloud</span>, &{" "}
                <span style={{ color: GRUVBOX.orange }}>Cybersecurity</span>. I build things,
                break things, and automate everything in between.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap", alignItems: "center" }}>
                {["Python", "Bash"].map((t, i) => (
                  <span key={t} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: [GRUVBOX.yellow, GRUVBOX.green][i], background: `${[GRUVBOX.yellow, GRUVBOX.green][i]}12`, padding: "6px 14px", borderRadius: 6, border: `1px solid ${[GRUVBOX.yellow, GRUVBOX.green][i]}30` }}>{t}</span>
                ))}
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: GRUVBOX.fg4, padding: "6px 4px" }}>+</span>
                {["GoLang", "AWS", "Docker", "Azure"].map(t => (
                  <span key={t} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: GRUVBOX.fg4, background: `${GRUVBOX.fg4}10`, padding: "6px 14px", borderRadius: 6, border: `1px dashed ${GRUVBOX.bg3}`, fontStyle: "italic" }}>{t} ↗</span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Projects */}
        <div id="projects" style={{ paddingTop: 40, paddingBottom: 60 }}>
          <Reveal><h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: GRUVBOX.fg4, textTransform: "uppercase", letterSpacing: 3, marginBottom: 40 }}><span style={{ color: GRUVBOX.green }}>##</span> Projects</h2></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {PROJECTS_DATA.map((p, i) => (
              <Reveal key={p.name} delay={0.08 * i}>
                <div onMouseEnter={() => setHoveredProject(i)} onMouseLeave={() => setHoveredProject(null)} onClick={() => p.link !== "#" && window.open(p.link, "_blank")}
                  style={{ background: hoveredProject === i ? GRUVBOX.bg1 : `${GRUVBOX.bg0_h}cc`, border: `1px solid ${hoveredProject === i ? p.color + "60" : GRUVBOX.bg2}`, borderRadius: 12, cursor: p.link !== "#" ? "pointer" : "default", transition: "all 0.3s ease", transform: hoveredProject === i ? "translateY(-4px)" : "none", position: "relative", overflow: "hidden", height: "100%" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: p.color, opacity: hoveredProject === i ? 1 : 0.3, transition: "opacity 0.3s" }} />
                  <ProjectPreview color={p.color} image={p.image} />
                  <div style={{ padding: "20px 24px 24px" }}>
                    <h3 style={{ margin: "0 0 10px 0", fontSize: 18, fontWeight: 700, color: GRUVBOX.fg }}>{p.name}</h3>
                    <p style={{ margin: "0 0 18px 0", fontSize: 14, lineHeight: 1.6, color: GRUVBOX.fg4 }}>{p.desc}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {p.tech.map(t => <span key={t} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: p.color, background: `${p.color}15`, padding: "3px 10px", borderRadius: 4 }}>{t}</span>)}
                    </div>
                  </div>
                  {p.link !== "#" && <div style={{ position: "absolute", top: 172, right: 16, color: GRUVBOX.fg4, fontSize: 12, opacity: hoveredProject === i ? 1 : 0, transition: "opacity 0.3s" }}>↗</div>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div id="experience" style={{ paddingTop: 40, paddingBottom: 60 }}>
          <Reveal><h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: GRUVBOX.fg4, textTransform: "uppercase", letterSpacing: 3, marginBottom: 40 }}><span style={{ color: GRUVBOX.green }}>##</span> Experience</h2></Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {EXPERIENCE_DATA.map((exp, i) => (
              <Reveal key={exp.role} delay={0.1 * i}>
                <div style={{ background: `${GRUVBOX.bg0_h}cc`, border: `1px solid ${GRUVBOX.bg2}`, borderRadius: 12, padding: 28, borderLeft: `3px solid ${GRUVBOX.aqua}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                    <div><h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: GRUVBOX.fg }}>{exp.role}</h3><p style={{ margin: "4px 0 0 0", fontSize: 14, color: GRUVBOX.aqua }}>{exp.company}</p></div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: GRUVBOX.fg4, background: GRUVBOX.bg1, padding: "4px 12px", borderRadius: 4, whiteSpace: "nowrap" }}>{exp.date}</span>
                  </div>
                  <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                    {exp.points.map((pt, idx) => <p key={idx} style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: GRUVBOX.fg3, paddingLeft: 16, position: "relative" }}><span style={{ position: "absolute", left: 0, color: GRUVBOX.fg4 }}>›</span>{pt}</p>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div id="skills" style={{ paddingTop: 40, paddingBottom: 60 }}>
          <Reveal><h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: GRUVBOX.fg4, textTransform: "uppercase", letterSpacing: 3, marginBottom: 40 }}><span style={{ color: GRUVBOX.green }}>##</span> Skills</h2></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {[
              { cat: "Languages", items: ["Python", "Bash", "SQL"], color: GRUVBOX.yellow },
              { cat: "Tools & Platforms", items: ["Git/GitHub", "VS Code", "ServiceNow", "MS365", "Supabase"], color: GRUVBOX.purple },
              { cat: "OS & Systems", items: ["Linux (Fedora)", "Windows 11", "Active Directory", "Networking"], color: GRUVBOX.aqua },
              { cat: "Learning", items: ["GoLang", "AWS", "Docker", "Azure", "Kotlin"], color: GRUVBOX.orange, dashed: true },
            ].map((g, i) => (
              <Reveal key={g.cat} delay={0.08 * i}>
                <div style={{ background: `${GRUVBOX.bg0_h}cc`, border: `1px ${g.dashed ? "dashed" : "solid"} ${g.dashed ? GRUVBOX.bg3 : GRUVBOX.bg2}`, borderRadius: 12, padding: 24, height: "100%" }}>
                  <h3 style={{ margin: "0 0 14px 0", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: g.color, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                    {g.cat}{g.dashed && <span style={{ fontSize: 10, opacity: 0.6, fontWeight: 400 }}>// in progress</span>}
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {g.items.map(item => <span key={item} style={{ fontSize: 13, color: g.dashed ? GRUVBOX.fg4 : GRUVBOX.fg3, background: GRUVBOX.bg1, padding: "5px 12px", borderRadius: 6, fontStyle: g.dashed ? "italic" : "normal" }}>{item}</span>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <div style={{ marginTop: 24 }}>
              <div style={{ background: `${GRUVBOX.bg0_h}cc`, border: `1px solid ${GRUVBOX.bg2}`, borderRadius: 12, padding: "20px 28px" }}>
                <h3 style={{ margin: "0 0 8px 0", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: GRUVBOX.green }}>Education</h3>
                <p style={{ margin: 0, fontSize: 15, color: GRUVBOX.fg, fontWeight: 600 }}>University of Alabama at Birmingham</p>
                <p style={{ margin: "4px 0 0 0", fontSize: 13, color: GRUVBOX.fg4 }}>B.A. Computer Science · Minor: Social Psych & Info Systems · Dec 2026</p>
                <p style={{ margin: "2px 0 0 0", fontSize: 13, color: GRUVBOX.fg4 }}>Accelerated M.S. Cybersecurity Track</p>
                <p style={{ margin: "6px 0 0 0", fontSize: 12, color: GRUVBOX.aqua }}>Honors College · Tri-Alpha Honor Society</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Contact */}
        <div id="contact" style={{ paddingTop: 40, paddingBottom: 100 }}>
          <Reveal><h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: GRUVBOX.fg4, textTransform: "uppercase", letterSpacing: 3, marginBottom: 40 }}><span style={{ color: GRUVBOX.green }}>##</span> Contact</h2></Reveal>
          <Reveal delay={0.1}>
            <div style={{ background: `${GRUVBOX.bg0_h}cc`, border: `1px solid ${GRUVBOX.bg2}`, borderRadius: 12, padding: 40, textAlign: "center" }}>
              <p style={{ fontSize: 20, color: GRUVBOX.fg, margin: "0 0 8px 0", fontWeight: 600 }}>Let's build something together.</p>
              <p style={{ fontSize: 14, color: GRUVBOX.fg4, margin: "0 0 32px 0" }}>Open to internships in DevOps, Cloud, and Cybersecurity.</p>
              <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
                <a href="mailto:etran0155@gmail.com" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GRUVBOX.green, color: GRUVBOX.bg, padding: "12px 28px", borderRadius: 8, textDecoration: "none", fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600 }}>✉ etran0155@gmail.com</a>
                <a href="https://github.com/lixeron" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GRUVBOX.bg1, color: GRUVBOX.fg, padding: "12px 28px", borderRadius: 8, textDecoration: "none", fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, border: `1px solid ${GRUVBOX.bg3}` }}><GitHubIcon size={16} /> github.com/lixeron</a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
      <Reveal>
        <div style={{ borderTop: `1px solid ${GRUVBOX.bg2}`, padding: "20px 32px", textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: GRUVBOX.fg4, position: "relative", zIndex: 1 }}>
          built with gruvbox, caffeine, and too many late nights © 2026
        </div>
      </Reveal>
    </div>
  );
}

/* ═══════ CRT TRANSITION ═══════ */
function CRTTransition({ onComplete }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t = [setTimeout(() => setPhase(1), 100), setTimeout(() => setPhase(2), 600), setTimeout(() => setPhase(3), 1200), setTimeout(() => setPhase(4), 1800), setTimeout(() => onComplete(), 2600)];
    return () => t.forEach(clearTimeout);
  }, [onComplete]);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: GRUVBOX.bg, overflow: "hidden" }}>
      <style>{`
        @keyframes scanline{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
        @keyframes flicker{0%,100%{opacity:1}10%{opacity:.8}30%{opacity:.6}50%{opacity:.4}70%{opacity:.3}90%{opacity:.1}}
        @keyframes distort{0%{transform:skewX(0)scaleY(1)}20%{transform:skewX(-5deg)scaleY(1.02)}40%{transform:skewX(8deg)scaleY(.97)}60%{transform:skewX(-12deg)scaleY(1.05)}80%{transform:skewX(3deg)scaleY(.95)}100%{transform:skewX(0)scaleY(0)}}
        @keyframes glitchSlice{0%{clip-path:inset(0 0 95% 0);transform:translateX(0)}25%{clip-path:inset(20% 0 60% 0);transform:translateX(-20px)}50%{clip-path:inset(50% 0 30% 0);transform:translateX(15px)}75%{clip-path:inset(70% 0 10% 0);transform:translateX(-10px)}100%{clip-path:inset(90% 0 0 0);transform:translateX(5px)}}
        @keyframes shrinkToLine{0%{transform:scaleY(1);opacity:1}60%{transform:scaleY(.02);opacity:1}100%{transform:scaleY(0);opacity:0}}
      `}</style>
      {phase >= 1 && phase < 4 && <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.15) 2px,rgba(0,0,0,.15) 4px)`, animation: "scanline .3s linear infinite", pointerEvents: "none" }} />}
      {phase >= 1 && (
        <div style={{ position: "absolute", inset: 0, background: GRUVBOX.bg, animation: phase >= 3 ? "flicker .4s ease-in forwards" : "none" }}>
          <div style={{ position: "absolute", inset: 0, animation: phase >= 2 ? "distort 1s ease-in forwards" : "none" }}>
            {[0,1,2].map(idx => (
              <div key={idx} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: "clamp(24px,4vw,48px)", fontWeight: 700, color: [GRUVBOX.red,GRUVBOX.green,GRUVBOX.blue][idx], opacity: phase >= 2 ? .7 : 0, animation: phase >= 2 ? `glitchSlice .5s ${idx*.1}s ease-in-out infinite alternate` : "none", mixBlendMode: "screen" }}>Loading portfolio...</div>
            ))}
          </div>
        </div>
      )}
      {phase >= 3 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "100%", height: "100%", background: GRUVBOX.bg, animation: "shrinkToLine .8s .2s ease-in forwards" }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 4, height: 4, background: GRUVBOX.fg, borderRadius: "50%", boxShadow: `0 0 30px 10px ${GRUVBOX.fg}40`, opacity: phase >= 4 ? 0 : 1, transition: "opacity .5s" }} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════ TERMINAL ═══════ */
export default function App() {
  const [scene, setScene] = useState("terminal");
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [typingNeofetch, setTypingNeofetch] = useState(true);
  const termRef = useRef(null);
  const inputRef = useRef(null);
  const visitorOS = useMemo(() => getVisitorOS(), []);
  const asciiChoice = useMemo(() => getRandomArt(), []);
  const neofetchLines = useMemo(() => buildNeofetchLines(visitorOS, asciiChoice), [visitorOS, asciiChoice]);

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

  const handleCommand = useCallback(cmd => {
    const trimmed = cmd.trim().toLowerCase();
    const prompt = `  \x1b[green]lixeron\x1b[fg4]@\x1b[blue]fedora\x1b[reset]:\x1b[yellow]~\x1b[reset]$ ${cmd}`;
    const nl = [prompt];
    switch (trimmed) {
      case "ls": nl.push("  \x1b[green]about.txt\x1b[reset]    \x1b[green]projects/\x1b[reset]    \x1b[green]contact.txt\x1b[reset]    \x1b[yellow]portfolio.sh\x1b[reset]"); break;
      case "help":
        nl.push("  \x1b[yellow]Available commands:\x1b[reset]");
        nl.push("    \x1b[green]ls\x1b[reset]                  List files");
        nl.push("    \x1b[green]cat about.txt\x1b[reset]       Who am I");
        nl.push("    \x1b[green]cat contact.txt\x1b[reset]     How to reach me");
        nl.push("    \x1b[green]ls projects\x1b[reset]         View my projects");
        nl.push("    \x1b[green]./portfolio.sh\x1b[reset]      Launch the portfolio");
        nl.push("    \x1b[green]clear\x1b[reset]               Clear terminal");
        nl.push("    \x1b[green]neofetch\x1b[reset]            Show system info"); break;
      case "cat about.txt": FILES["about.txt"].split("\n").forEach(l => nl.push(l)); break;
      case "cat contact.txt": FILES["contact.txt"].split("\n").forEach(l => nl.push(l)); break;
      case "ls projects": case "ls projects/": PROJECTS_LIST.split("\n").forEach(l => nl.push(l)); break;
      case "./portfolio.sh": nl.push("  \x1b[green]▶ Launching portfolio...\x1b[reset]"); addLines(nl); setTimeout(() => setTransitioning(true), 500); return;
      case "clear": setLines([]); return;
      case "neofetch": neofetchLines.forEach(l => nl.push(l)); break;
      case "sudo rm -rf /": case "sudo rm -rf / --no-preserve-root": nl.push("  \x1b[red]Nice try.\x1b[reset]"); break;
      case "whoami": nl.push("  \x1b[green]lixeron\x1b[reset]"); break;
      case "pwd": nl.push("  /home/lixeron"); break;
      case "date": nl.push(`  ${new Date().toString()}`); break;
      case "uname -a": case "uname": nl.push("  Linux fedora 6.8.0 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux"); break;
      case "": break;
      default: nl.push(`  \x1b[red]bash: ${trimmed}: command not found\x1b[reset]`); nl.push(`  \x1b[fg4]Type \x1b[green]help\x1b[fg4] for available commands.\x1b[reset]`);
    }
    addLines(nl);
  }, [addLines, neofetchLines]);

  const handleKeyDown = useCallback(e => { if (typingNeofetch) return; if (e.key === "Enter") { handleCommand(input); setInput(""); } }, [input, handleCommand, typingNeofetch]);
  const handleTransitionComplete = useCallback(() => { setTransitioning(false); setScene("portfolio"); }, []);
  const handleBackToTerminal = useCallback(() => { setScene("terminal"); setLines(p => [...p, "", "  \x1b[fg4]Welcome back.\x1b[reset]", ""]); }, []);

  if (transitioning) return <CRTTransition onComplete={handleTransitionComplete} />;
  if (scene === "portfolio") return <Portfolio onBack={handleBackToTerminal} />;

  return (
    <div onClick={() => inputRef.current?.focus()} style={{ height: "100vh", background: GRUVBOX.bg, display: "flex", flexDirection: "column", cursor: "text", position: "relative", overflow: "hidden" }}>
      <style>{GLOBAL_CSS}</style>
      <HollywoodBG opacity={0.5} />
      <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.03) 3px,rgba(0,0,0,.03) 4px)`, pointerEvents: "none", zIndex: 1 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: `${GRUVBOX.bg1}ee`, borderBottom: `1px solid ${GRUVBOX.bg2}`, position: "relative", zIndex: 2, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: GRUVBOX.red }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: GRUVBOX.yellow }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: GRUVBOX.green }} />
        </div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: GRUVBOX.fg4, marginLeft: 12 }}>lixeron@fedora: ~</span>
        <div style={{ flex: 1 }} />
        <button onClick={e => { e.stopPropagation(); handleCommand("./portfolio.sh"); }}
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: GRUVBOX.fg4, background: GRUVBOX.bg2, border: `1px solid ${GRUVBOX.bg3}`, padding: "4px 12px", borderRadius: 4, cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => { e.target.style.color = GRUVBOX.green; e.target.style.borderColor = GRUVBOX.green; }}
          onMouseLeave={e => { e.target.style.color = GRUVBOX.fg4; e.target.style.borderColor = GRUVBOX.bg3; }}>skip → portfolio</button>
      </div>
      <div ref={termRef} style={{ flex: 1, padding: "12px 16px", overflowY: "auto", position: "relative", zIndex: 2 }}>
        {lines.map((line, i) => <TerminalLine key={i} text={line} />)}
        {!typingNeofetch && (
          <div style={{ display: "flex", alignItems: "center", minHeight: "1.5em", whiteSpace: "pre", ...TERM_FONT }}>
            <span style={{ color: GRUVBOX.green }}>  lixeron</span><span style={{ color: GRUVBOX.fg4 }}>@</span><span style={{ color: GRUVBOX.blue }}>fedora</span><span style={{ color: GRUVBOX.fg }}>:</span><span style={{ color: GRUVBOX.yellow }}>~</span><span style={{ color: GRUVBOX.fg }}>$ </span><span style={{ color: GRUVBOX.fg }}>{input}</span>
            <span style={{ display: "inline-block", width: 8, height: 16, background: showCursor ? GRUVBOX.fg : "transparent", marginLeft: 1, verticalAlign: "middle", transition: "background 0.1s" }} />
          </div>
        )}
      </div>
      <input ref={inputRef} autoFocus value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} aria-hidden="true" tabIndex={-1}
        style={{ position: "fixed", top: -9999, left: -9999, width: 1, height: 1, padding: 0, margin: 0, border: "none", outline: "none", background: "transparent", color: "transparent", caretColor: "transparent", opacity: 0, fontSize: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }} />
    </div>
  );
}