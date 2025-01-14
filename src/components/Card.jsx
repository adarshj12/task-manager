import React, { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Modal, Button, Input, DatePicker, Whisper, Tooltip } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { FaPhone, FaFile } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import moment from "moment";
import './Card.css';

function Card({ task, fromColumn }) {
    const [, drag] = useDrag({
        type: 'CARD',
        item: { task, fromColumn },
    });

    function dateStyle(dueDate) {
        let style = {
            background: 'green',
            color: '#fff'
        }
        if (new Date(dueDate).toString().slice(4,15) == new Date().toString().slice(4,15)) {
            style['background'] = 'green';
            style['color'] = '#fff'
        } else if (new Date(dueDate) >= new Date()) {
            style['background'] = '#fcba03';
            style['color'] = '#fff'
        } else if (new Date(dueDate) < new Date()) {
            style['background'] = 'red'
            style['color'] = '#fff'
        }
        return style;
    }

    return (
        <div
            ref={drag}
            className="card-body"
        >
            <div
                className="card-options"
            >
                <span style={{ marginBottom: "10px", display: "inline-block" }}>
                    <Whisper
                        placement="top"
                        controlId="control-id-hover"
                        trigger="hover"
                        speaker={<Tooltip>Contact</Tooltip>}
                    >
                        <Button>
                            <FaPhone style={{ fontSize: "20px", cursor: "pointer" }} />
                        </Button>
                    </Whisper>
                </span>


                <span style={{ marginBottom: "10px", display: "inline-block" }}>
                    <Whisper
                        placement="top"
                        controlId="control-id-hover"
                        trigger="hover"
                        speaker={<Tooltip>Email</Tooltip>}
                    >
                        <Button>
                            <MdEmail style={{ fontSize: "20px", cursor: "pointer" }} />
                        </Button>
                    </Whisper>
                </span>


                <span style={{ marginBottom: "10px", display: "inline-block" }}>
                    <Whisper
                        placement="top"
                        controlId="control-id-hover"
                        trigger="hover"
                        speaker={<Tooltip>Notes</Tooltip>}
                    >
                        <Button>
                            <FaFile style={{ fontSize: "20px", cursor: "pointer" }} />
                        </Button>
                    </Whisper>
                </span>
            </div>


            <div className="task-body">
                <div>
                    <strong>{task.task}</strong>
                </div>
                <div className="date-class">
                    <p style={dateStyle(task.dueDate)}>
                        {moment(task.dueDate).format('ll')}
                    </p>
                </div>
            </div>
        </div>

    );
}

export default Card;