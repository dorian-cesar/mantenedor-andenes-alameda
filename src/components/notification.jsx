"use client";
import Swal from "sweetalert2";
import { useEffect } from "react";

export default function Notification({ type = "info", message, title, timer = 2000 }) {
    useEffect(() => {
        if (!message) return;

        const titles = {
            success: "Éxito",
            error: "Error",
            warning: "Atención",
            info: "Información",
            question: "Confirmar"
        };

        Swal.fire({
            icon: type,
            title: title || titles[type],
            text: message,
            timer,
            showConfirmButton: false,
            timerProgressBar: true,
            toast: true,
            position: "top-end",
        });
    }, [type, message, title, timer]);

    return null;
}
