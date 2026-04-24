export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        indigo: "#4f46e5",
        purple: "#7c3aed",
        cyan: "#06b6d4",
        forge: "#16a34a",
        ember: "#f97316",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.10)",
      },
      screens: {
        xs: "360px",
      },
    },
  },
  plugins: [],
};
