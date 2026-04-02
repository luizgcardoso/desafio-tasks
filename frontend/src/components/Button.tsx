export default function Button( props: { text: string } & { type?: 'submit' | 'button' | 'reset', className?: string, actions?: () => void }) {
  return (
    <button
      className={props.className}
      onClick={props.actions}
      type={props.type}>
      {props.text}
    </button>
  );
}