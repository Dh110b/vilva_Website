// Shared brand mark used by generated favicon / apple-icon / OG image routes.
// Path data is the checkmark swoosh extracted from public/logo.svg.
export function BrandMark({ width }: { width: number }) {
  const height = width * (12461 / 25265);
  return (
    <svg
      width={width}
      height={height}
      viewBox="32367 6270 25265 12461"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="brandMarkBlue" gradientUnits="userSpaceOnUse" x1="44165" y1="12500" x2="55256" y2="12500">
          <stop offset="0" stopColor="#1B4E9B" />
          <stop offset="0.5" stopColor="#00A0E3" />
        </linearGradient>
        <linearGradient id="brandMarkOrange" gradientUnits="userSpaceOnUse" x1="38352" y1="17786" x2="38352" y2="13377">
          <stop offset="0" stopColor="#E31E24" />
          <stop offset="0.5" stopColor="#F39313" />
        </linearGradient>
      </defs>
      <path
        fill="url(#brandMarkBlue)"
        d="M44716 18731c271,0 532,-33 786,-92 1243,-290 2310,-1247 3296,-2513 482,-618 946,-1310 1400,-2032 2232,-3543 4270,-7824 7434,-7824l-5474 0c-3186,0 -5229,4337 -7479,7895 -6,9 -12,19 -19,29 -744,1176 -1511,2262 -2349,3078 -171,166 -346,317 -523,459 774,621 1613,998 2550,998l378 2z"
      />
      <path
        fill="url(#brandMarkOrange)"
        d="M41788 17730c-760,-610 -1458,-1456 -2126,-2414 -624,-896 -1223,-1890 -1821,-2883l-5474 0c1892,3137 3779,6296 6497,6296l5474 0c-937,0 -1776,-377 -2550,-998z"
      />
    </svg>
  );
}
