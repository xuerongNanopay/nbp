import { IconSvgProps } from "@/type";

export const ErrorIcon = (props: IconSvgProps) => (
  <svg 
    // xmlns="http://www.w3.org/2000/svg" 
    width="26" height="26" 
    viewBox="0 0 48 48"
    {...props}
  >
    <g fill="none" fillRule="evenodd">
        <path fill="#F91C1C" fillRule="nonzero" d="M44 16.336v14.457a3 3 0 0 1-.866 2.108L32.881 43.278a3 3 0 0 1-2.134.892h-13.45a3 3 0 0 1-2.13-.888L4.87 32.902A3 3 0 0 1 4 30.789V16.346a3 3 0 0 1 .975-2.213l10.213-9.346A3 3 0 0 1 17.213 4h13.693a3 3 0 0 1 2.037.798l10.094 9.336A3 3 0 0 1 44 16.336zm-10-.322L31.986 14 24 21.986 16.014 14 14 16.014 21.986 24 14 31.986 16.014 34 24 26.014 31.986 34 34 31.986 26.014 24 34 16.014z"/>
        <path d="M0 0h48v48H0z"/>
    </g>
  </svg>
)