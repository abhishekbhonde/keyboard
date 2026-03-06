import { memo } from 'react';
import './Key.css';

const Key = memo(function Key({ keyData, isPressed, onKeyDown, onKeyUp }) {
    const { id, label, subLabel, width, type } = keyData;

    const style = {
        '--key-width': width,
    };

    const classNames = [
        'key',
        `key--${type}`,
        isPressed ? 'key--pressed' : '',
    ].filter(Boolean).join(' ');

    return (
        <button
            className={classNames}
            style={style}
            onMouseDown={() => onKeyDown(keyData)}
            onMouseUp={() => onKeyUp(keyData)}
            onMouseLeave={() => isPressed && onKeyUp(keyData)}
            data-key-id={id}
            tabIndex={-1}
        >
            <span className="key__top">
                {subLabel && <span className="key__label-main">{label}</span>}
                {subLabel && <span className="key__label-sub">{subLabel}</span>}
                {!subLabel && <span className="key__label">{label}</span>}
            </span>
            <span className="key__front" />
        </button>
    );
});

export default Key;
