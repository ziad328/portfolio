import SmoothScroll from '@/components/SmoothScroll';
import CustomCursor from '@/components/CustomCursor';

// The public site. Smooth scrolling and the custom cursor live here rather than in the root layout,
// so /admin (outside this group) doesn't get them, without reading the pathname.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      {children}
    </>
  );
}
