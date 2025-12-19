"use strict";

import { useEffect } from "react";

export default function TopBar({
    title,
    callback,
    canCallback,
}) {

    return (
        <>
            <div className="top-bar">
                {canCallback !== "no" ? (
                    <>
                        <button
                            className="top-bar-button"
                            onClick={callback}
                            aria-label="Back"
                        >
                            &lt;
                        </button>
                        <div className="top-bar-spacer" />
                    </>
                ) : (
                    <>
                        <div className="top-bar-spacer" />
                        <div className="top-bar-spacer" />
                    </>
                )}

                <h1 className="top-bar-title">{title}</h1>
                <div className="top-bar-spacer" />
                <div className="top-bar-spacer" />
            </div>

        </>
    );
}