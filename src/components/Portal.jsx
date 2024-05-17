import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";

/**
 * Portal component renders its children into a portal root element.
 * If portalRoot is not provided, it creates a new div element with the specified defaultPortalRootId or uses the existing one.
 * @param {object} props - Component props.
 * @param {string} [props.defaultPortalRootId='portal-root'] - The id of the default portal root element.
 * @param {HTMLElement} [props.portalRoot] - Optional portal root element. If provided, children will be appended to this element.
 * @param {React.ReactNode} props.children - The children to be rendered into the portal.
 * @returns {null} - Since we are not rendering anything in the component tree.
 */
const Portal = ({
  defaultPortalRootId = "portal-root",
  portalRoot: externalPortalRoot,
  children,
}) => {
  const [portalRoot, setPortalRoot] = useState(null);

  useEffect(() => {
    const existingPortalRoot =
      externalPortalRoot || document.getElementById(defaultPortalRootId);

    if (!existingPortalRoot) {
      const newPortalRoot = document.createElement("div");
      newPortalRoot.id = defaultPortalRootId;
      document.body.appendChild(newPortalRoot);
      setPortalRoot(newPortalRoot);
      return () => document.body.removeChild(newPortalRoot);
    } else {
      setPortalRoot(existingPortalRoot);
      return () => {};
    }
  }, [defaultPortalRootId, externalPortalRoot]);

  return portalRoot ? createPortal(children, portalRoot) : null;
};

Portal.propTypes = {
  defaultPortalRootId: PropTypes.string,
  portalRoot: PropTypes.instanceOf(HTMLElement),
  children: PropTypes.node.isRequired,
};

export { Portal };
