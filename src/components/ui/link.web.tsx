import { cn } from "@/lib/utils";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { Link as XLink } from "expo-router";
import React from "react";
import { SFIcon } from "@/components/ui/sf-icon";

const ChevronIcon: React.FC<React.ComponentProps<"svg">> = (props) => (
  <svg
    viewBox="0 0 60.1500244140625 84.8134765625"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g transform="matrix(1 0 0 1 -6.250019531250018 77.63671875)">
      <path d="M6.25-35.2539C6.25-34.0332 6.68945-32.959 7.61719-32.0312L46.3379 5.81055C47.168 6.68945 48.2422 7.12891 49.5117 7.12891C52.0508 7.12891 54.0039 5.22461 54.0039 2.68555C54.0039 1.41602 53.4668 0.341797 52.6855-0.488281L17.1387-35.2539L52.6855-70.0195C53.4668-70.8496 54.0039-71.9727 54.0039-73.1934C54.0039-75.7324 52.0508-77.6367 49.5117-77.6367C48.2422-77.6367 47.168-77.1973 46.3379-76.3672L7.61719-38.4766C6.68945-37.5977 6.25-36.4746 6.25-35.2539Z"></path>
    </g>
  </svg>
);

export function Link(props: React.ComponentProps<typeof XLink>) {
  if (!isLinkWithPreview(props)) {
    return <XLink {...props} />;
  }

  return <LinkWithPreview {...props} />;
}

function LinkWithPreview(props: React.ComponentProps<typeof XLink>) {
  const triggerElement = React.useMemo(
    () => getFirstChildOfType(props.children, XLink.Trigger),
    [props.children]
  );
  const menuElement = React.useMemo(
    () => getFirstChildOfType(props.children, XLink.Menu),
    [props.children]
  );

  // If no menu, just render the link
  if (!menuElement) {
    return <XLink {...props} />;
  }

  return (
    <ContextMenu.Root>
      <XLink {...props}>
        <ContextMenu.Trigger asChild>{triggerElement}</ContextMenu.Trigger>
      </XLink>

      <ContextMenu.Portal>
        <MenuContent menuElement={menuElement} />
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}

function MenuContent({ menuElement }: { menuElement: React.ReactElement }) {
  const title = menuElement.props.title;
  const children = menuElement.props.children;

  return (
    <ContextMenu.Content
      className={cn(
        "bg-sf-bg-2/20 backdrop-blur-xl select-none border-[0.5px] border-sf-border rounded-3xl corner-sf p-1.5 shadow-2xl min-w-[220px] overflow-hidden focus:outline-none pb-2",
        "web:data-[state=open]:animate-in web:data-[state=closed]:animate-out",
        "web:data-[state=closed]:fade-out-0 web:data-[state=open]:fade-in-0",
        "web:data-[state=closed]:zoom-out-95 web:data-[state=open]:zoom-in-95"
      )}
    >
      {title && (
        <div className="px-5 py-4 text-xs text-sf-text-2 font-medium">
          {title}
        </div>
      )}
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;

        // Check if it's a nested Link.Menu (submenu)
        if (child.type === XLink.Menu) {
          return <SubMenu menuElement={child} />;
        }

        // Otherwise it's a Link.MenuAction
        if (child.type === XLink.MenuAction) {
          return <MenuItem actionElement={child} />;
        }

        return null;
      })}
    </ContextMenu.Content>
  );
}

function SubMenu({ menuElement }: { menuElement: React.ReactElement }) {
  const title = menuElement.props.title;
  const icon = menuElement.props.icon;
  const children = menuElement.props.children;
  const destructive = menuElement.props.destructive;

  return (
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger
        className={cn(
          "gap-3 rounded-full corner-sf group flex items-center px-1 pl-4 py-0.5 text-sm leading-7 cursor-default outline-none web:transition-colors",
          "hover:bg-sf-fill-3",
          !destructive
            ? "text-sf-text active:text-sf-text-4 active:bg-sf-blue/15 fill-sf-blue"
            : "text-sf-red active:text-sf-red/15 active:bg-sf-red/15 fill-sf-red"
        )}
      >
        {icon && (
          <div className="flex items-center justify-center w-7 h-7 web:transition-opacity group-active:opacity-30">
            <SFIcon name={icon} className="text-xl" />
          </div>
        )}
        {title}
        <div className="ml-auto pl-5 fill-sf-text-2 group-data-[disabled]:fill-sf-text-3 group-data-[state=open]:fill-sf-text web:transition-colors">
          <ChevronIcon className="scale-[-50%] w-7 h-7" />
        </div>
      </ContextMenu.SubTrigger>
      <ContextMenu.Portal>
        <ContextMenu.SubContent
          className={cn(
            "rounded-3xl corner-sf bg-sf-bg-2/20 backdrop-blur-xl border-[0.5px] border-sf-border p-1.5 shadow-2xl min-w-[220px] overflow-hidden focus:outline-none",
            "web:data-[state=open]:animate-in web:data-[state=closed]:animate-out",
            "web:data-[state=closed]:fade-out-0 web:data-[state=open]:fade-in-0",
            "web:data-[state=closed]:zoom-out-95 web:data-[state=open]:zoom-in-95"
          )}
        >
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return null;

            // Support nested submenus
            if (child.type === XLink.Menu) {
              return <SubMenu menuElement={child} />;
            }

            if (child.type === XLink.MenuAction) {
              return <MenuItem actionElement={child} />;
            }

            return null;
          })}
        </ContextMenu.SubContent>
      </ContextMenu.Portal>
    </ContextMenu.Sub>
  );
}

function MenuItem({ actionElement }: { actionElement: React.ReactElement }) {
  const title = actionElement.props.title;
  const icon = actionElement.props.icon;
  const destructive = actionElement.props.destructive;
  const onPress = actionElement.props.onPress;

  return (
    <ContextMenu.Item
      className={cn(
        "pl-5 gap-3 rounded-full corner-sf group flex items-center px-3 py-1 text-base leading-7 cursor-default outline-none web:transition-colors",
        "hover:bg-sf-fill-3",
        "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
        !destructive
          ? "text-sf-text active:text-sf-text-4 active:bg-sf-blue/15 fill-sf-blue"
          : "text-sf-red active:text-sf-red/15 active:bg-sf-red/15 fill-sf-red"
      )}
      onSelect={(e) => {
        if (onPress) {
          onPress(e);
        }
      }}
    >
      {icon && (
        <div className="flex items-center justify-center w-7 h-7 web:transition-opacity group-active:opacity-30">
          <SFIcon name={icon} className="text-base" />
        </div>
      )}
      {title}
    </ContextMenu.Item>
  );
}

function getFirstChildOfType(children: React.ReactNode, type: any) {
  return React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === type
  ) as React.ReactElement | undefined;
}

function isLinkWithPreview(props: React.ComponentProps<typeof XLink>) {
  return React.Children.toArray(props.children).some(
    (child) =>
      React.isValidElement(child) &&
      (child.type === XLink.Preview || child.type === XLink.Menu)
  );
}

// Export Link components
Link.resolveHref = XLink.resolveHref;
Link.Trigger = XLink.Trigger;
Link.Menu = XLink.Menu;
Link.MenuAction = XLink.MenuAction;

// Preview shim for future implementation
Link.Preview = function Preview(_props: any) {
  return null;
};
