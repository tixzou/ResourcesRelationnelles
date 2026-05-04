import React, { useState } from 'react';

const unwrapText = (value: any) => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(unwrapText).join(' ');
  if (React.isValidElement(value)) return unwrapText((value.props as any).children);
  return '';
};

export function Button({ children, onPress, isIconOnly, type, className }: any) {
  return (
    <button type={type || 'button'} aria-label={isIconOnly ? 'icon-button' : undefined} onClick={onPress} className={className}>
      {children}
    </button>
  );
}

export const Input = React.forwardRef<HTMLInputElement, any>(function Input(
  { value, onValueChange, onChange, label, placeholder, name, type, className },
  ref,
) {
  const valueProps = value !== undefined ? { value } : {};

  return (
    <label>
      {label}
      <input
        aria-label={label || placeholder}
        placeholder={placeholder}
        name={name}
        type={type}
        className={className}
        ref={ref}
        onChange={(event) => {
          onValueChange?.(event.target.value);
          onChange?.(event);
        }}
        {...valueProps}
      />
    </label>
  );
});

export const Textarea = React.forwardRef<HTMLTextAreaElement, any>(function Textarea(
  { value, onValueChange, onChange, label, placeholder, name },
  ref,
) {
  const valueProps = value !== undefined ? { value } : {};

  return (
    <label>
      {label}
      <textarea
        aria-label={label || placeholder}
        placeholder={placeholder}
        name={name}
        ref={ref}
        onChange={(event) => {
          onValueChange?.(event.target.value);
          onChange?.(event);
        }}
        {...valueProps}
      />
    </label>
  );
});

export function Select({ children, label, selectedKeys, onSelectionChange }: any) {
  const selected = Array.from(selectedKeys || [])[0] as string | undefined;

  return (
    <label>
      {label}
      <select
        aria-label={label}
        value={selected || ''}
        onChange={(event) => onSelectionChange?.(new Set([event.target.value]))}
      >
        <option value="" />
        {children}
      </select>
    </label>
  );
}

export function SelectItem({ children, ...props }: any) {
  return <option value={props.value || unwrapText(children)}>{children}</option>;
}

export const Checkbox = React.forwardRef<HTMLInputElement, any>(function Checkbox(
  { children, name, onChange },
  ref,
) {
  return (
    <label>
      <input type="checkbox" name={name} onChange={onChange} ref={ref} />
      {children}
    </label>
  );
});

export function Tabs({ children, onSelectionChange }: any) {
  return <div onClick={() => onSelectionChange?.('mes-ressources')}>{children}</div>;
}

export function Tab({ title, children }: any) {
  return (
    <section>
      <button type="button">{title}</button>
      {children}
    </section>
  );
}

export function Card({ children }: any) {
  return <article>{children}</article>;
}

export function CardHeader({ children }: any) {
  return <header>{children}</header>;
}

export function CardBody({ children }: any) {
  return <div>{children}</div>;
}

export function CardFooter({ children }: any) {
  return <footer>{children}</footer>;
}

export function Chip({ children }: any) {
  return <span>{children}</span>;
}

export function Spinner() {
  return <div role="status">Chargement</div>;
}

export function Avatar({ name }: any) {
  return <span>{name}</span>;
}

export function Divider() {
  return <hr />;
}

export function Link({ children, href }: any) {
  return <a href={href}>{children}</a>;
}

export function Navbar({ children }: any) {
  return <nav>{children}</nav>;
}

export function NavbarBrand({ children }: any) {
  return <div>{children}</div>;
}

export function NavbarContent({ children }: any) {
  return <div>{children}</div>;
}

export function NavbarItem({ children }: any) {
  return <div>{children}</div>;
}

export function NavbarMenu({ children }: any) {
  return <div>{children}</div>;
}

export function NavbarMenuItem({ children }: any) {
  return <div>{children}</div>;
}

export function NavbarMenuToggle() {
  return <button type="button">Menu</button>;
}

export function Modal({ children, isOpen }: any) {
  return isOpen ? <div role="dialog">{children}</div> : null;
}

export function ModalContent({ children }: any) {
  return <div>{typeof children === 'function' ? children(() => undefined) : children}</div>;
}

export function ModalHeader({ children }: any) {
  return <h2>{children}</h2>;
}

export function ModalBody({ children }: any) {
  return <div>{children}</div>;
}

export function ModalFooter({ children }: any) {
  return <div>{children}</div>;
}

export function useDisclosure() {
  const [isOpen, setIsOpen] = useState(false);
  return {
    isOpen,
    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
    onOpenChange: () => setIsOpen((current) => !current),
  };
}

export function Dropdown({ children }: any) {
  return <div>{children}</div>;
}

export function DropdownTrigger({ children }: any) {
  return <div>{children}</div>;
}

export function DropdownMenu({ children }: any) {
  return <div>{children}</div>;
}

export function DropdownItem({ children, onPress }: any) {
  return (
    <button type="button" onClick={onPress}>
      {children}
    </button>
  );
}

export const addToast = jest.fn();

export function Snippet({ children }: any) {
  return <pre>{unwrapText(children)}</pre>;
}
