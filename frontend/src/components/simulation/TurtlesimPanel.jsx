import React, { useEffect, useRef, useState } from 'react';
import { rosClient } from '../../services/rosClient';

const TurtlesimPanel = () => {
    const canvasRef = useRef(null);
    const [turtlePose, setTurtlePose] = useState(null);

    const CANVAS_WIDTH = 550;
    const CANVAS_HEIGHT = 550;

    useEffect(() => {
        if (!rosClient.isConnected()) return;

        const listener = rosClient.subscribeTopic('/turtle1/pose', 'turtlesim/msg/Pose', (msg) => {
            setTurtlePose(msg);
        });

        return () => {
            listener.unsubscribe();
        };
    }, [rosClient.isConnected()]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !turtlePose) return;
        const ctx = canvas.getContext('2d');

        // Arka planı çiz
        ctx.fillStyle = '#4A2A54'; // Turtlesim'in klasik rengi
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Kaplumbağayı çiz
        const scale = CANVAS_WIDTH / 11.1; // turtlesim 11.1x11.1'lik bir dünyadır
        const x = turtlePose.x * scale;
        const y = CANVAS_HEIGHT - (turtlePose.y * scale); // Y eksenini ters çevir

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-turtlePose.theta); // ROS'un yönünü canvas'a uyarla

        // Kaplumbağa gövdesi (basit bir imaj)
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, 2 * Math.PI);
        ctx.fillStyle = "cyan";
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(15, 0);
        ctx.strokeStyle = "white";
        ctx.stroke();

        ctx.restore();

    }, [turtlePose]);

    return (
        <div className="w-full h-full bg-gray-950 flex items-center justify-center p-4">
            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="border-2 border-primary/50 rounded-lg shadow-lg shadow-glow-blue"
            />
        </div>
    );
};

export default TurtlesimPanel;