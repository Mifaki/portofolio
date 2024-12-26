import useMediaQuery from "@/shared/usecase/useMediaQuery";

interface IMediaQuery {
  mobile: React.ReactNode;
  desktop: React.ReactNode;
  screenWidth: number;
}

export default function MediaQuerySwitcher({
  mobile = <div />,
  desktop = <div />,
  screenWidth = 768,
}: IMediaQuery) {
  const mediaMatches = useMediaQuery(screenWidth);
  if (mediaMatches) return desktop;
  return mobile;
}