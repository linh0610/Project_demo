import React from 'react';
import { useSwipeable } from 'react-swipeable';

const SwipeableCard = ({ children, onSwipe, onCardLeftScreen }) => {
    const handlers = useSwipeable({
        onSwiped: (dir) => onSwipe(dir),
        onSwipedLeft: () => onCardLeftScreen(),
        onSwipedRight: () => onCardLeftScreen(),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    return (
        <div {...handlers} className="swipe">
            {children}
        </div>
    );
};

export default SwipeableCard;
