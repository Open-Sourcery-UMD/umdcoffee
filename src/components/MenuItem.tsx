import type { LucideIcon } from 'lucide-react';

type MenuItemProps = {
  icon: LucideIcon;
  name: string;
  tag: string;
  description: string;
};

export default function MenuItem({ icon: Icon, name, tag, description }: MenuItemProps) {
  return (
    <li className="values-menu-item">
      <div className="values-menu-item-header">
        <Icon className="values-menu-item-icon" aria-hidden="true" focusable="false" />
        <h3 className="values-menu-item-name">{name}</h3>
        <span className="values-menu-item-leader" aria-hidden="true" />
        <span className="values-menu-item-tag">{tag}</span>
      </div>
      <p className="values-menu-item-description">{description}</p>
    </li>
  );
}
