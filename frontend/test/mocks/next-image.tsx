export default function Image(props: any) {
  // Mock simple: Next/Image est remplace par une image HTML classique en test.
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={props.alt || ''} />;
}
