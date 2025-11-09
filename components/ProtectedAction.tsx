import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedActionProps {
  children: React.ReactElement;
  fallbackTo?: string;
  onUnauthorized?: () => void;
}

/**
 * Composant qui protège une action en redirigeant vers inscription si l'utilisateur n'est pas connecté
 */
export const ProtectedAction: React.FC<ProtectedActionProps> = ({
  children,
  fallbackTo = '/signup',
  onUnauthorized
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      e.stopPropagation();
      
      if (onUnauthorized) {
        onUnauthorized();
      } else {
        navigate(fallbackTo);
      }
    } else {
      // Si l'utilisateur est connecté, on laisse l'événement se propager normalement
      if (children.props.onClick) {
        children.props.onClick(e);
      }
    }
  };

  const handleFocus = (e: React.FocusEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      e.stopPropagation();
      navigate(fallbackTo);
    } else {
      // Si l'utilisateur est connecté, on laisse l'événement se propager normalement
      if (children.props.onFocus) {
        children.props.onFocus(e);
      }
    }
  };

  // Cloner l'élément enfant en ajoutant nos gestionnaires d'événements
  return React.cloneElement(children, {
    onClick: handleClick,
    onFocus: handleFocus,
    ...children.props
  });
};