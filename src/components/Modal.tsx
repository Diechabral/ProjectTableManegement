import { ReactElement } from "react";

import "../styles/components/modal.css";

interface propsModal {
    visible: boolean;
    children: ReactElement<HTMLElement>[];
}

export function Modal(props: propsModal) {

    const { children, visible } = props;

    return (
        <>
            {
                visible &&
                <div className="AppModalBlankSpace">

                    <div className="AppModal">
                        { children }
                    </div>
                </div>
            }
        </>
    );
}