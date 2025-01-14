import React, { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import Card from "./Card";


export default function Column({ id, title, tasks, moveCard }) {
    const [, drop] = useDrop({
        accept: 'CARD',
        drop: (item) => moveCard(item.task, item.fromColumn, id),
    });

    return (
        <div
            ref={drop}
            style={{
                flex: 1,
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                minHeight: "300px",
                backgroundColor: "#f9f9f9",
            }}
        >
            <h3 style={{ textAlign: "center" }}>{title}</h3>
            {tasks?.map((task) => (
                <Card key={task._id} task={task} fromColumn={id} />
            ))}
        </div>
    );
}