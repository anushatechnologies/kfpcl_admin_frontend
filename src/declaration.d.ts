// src/declaration.d.ts
/// <reference types="vite/client" />
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.webp';
declare module '*.mp4';
declare module '*.mp3';
declare module '*.module.scss';
declare module '*.module.css';
