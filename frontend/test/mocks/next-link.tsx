export default function Link({ children, href, ...props }: any) {
  return (
    <a href={typeof href === 'string' ? href : '#'} {...props}>
      {children}
    </a>
  );
}
