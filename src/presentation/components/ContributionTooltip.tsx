import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { formatContributionDate } from '../utils/dateUtils';
import './styles/contribution-tooltip.css';

interface ContributionTooltipProps {
  date: string;
  count: number;
  x: number;
  y: number;
  visible: boolean;
}

export const ContributionTooltip: React.FC<ContributionTooltipProps> = ({
  date,
  count,
  x,
  y,
  visible,
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x, y });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!visible || !tooltipRef.current) {
      // Initialize position with mouse position
      setPosition({ x, y });
      return;
    }

    const updatePosition = () => {
      if (!tooltipRef.current) return;

      const tooltip = tooltipRef.current;
      const tooltipRect = tooltip.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const offset = 12; // Distance from cursor

      // Start with cursor position + offset
      let adjustedX = x + offset;
      let adjustedY = y + offset;

      // Adjust horizontal position if tooltip would overflow right edge
      if (adjustedX + tooltipRect.width > viewportWidth) {
        adjustedX = x - tooltipRect.width - offset;
      }

      // Adjust horizontal position if tooltip would overflow left edge
      if (adjustedX < offset) {
        adjustedX = offset;
      }

      // Adjust vertical position if tooltip would overflow bottom edge
      if (adjustedY + tooltipRect.height > viewportHeight) {
        adjustedY = y - tooltipRect.height - offset;
      }

      // Adjust vertical position if tooltip would overflow top edge
      if (adjustedY < offset) {
        adjustedY = offset;
      }

      setPosition({ x: adjustedX, y: adjustedY });
    };

    // Use requestAnimationFrame to ensure DOM is updated before calculating position
    requestAnimationFrame(() => {
      requestAnimationFrame(updatePosition);
    });
  }, [x, y, visible]);

  if (!visible || !mounted) {
    return null;
  }

  const formattedDate = formatContributionDate(date);
  const contributionText = count === 1 ? 'contribution' : 'contributions';

  const tooltipContent = (
    <div
      ref={tooltipRef}
      className="contribution-tooltip"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="contribution-tooltip-content">
        <div className="contribution-tooltip-count">
          <strong>{count}</strong> {contributionText}
        </div>
        <div className="contribution-tooltip-date">{formattedDate}</div>
      </div>
    </div>
  );

  // Render tooltip in a portal to body to avoid z-index issues
  return createPortal(tooltipContent, document.body);
};

