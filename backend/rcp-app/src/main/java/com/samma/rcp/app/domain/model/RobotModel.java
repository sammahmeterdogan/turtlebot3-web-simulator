package com.samma.rcp.app.domain.model;

public enum RobotModel {
    BURGER, WAFFLE, WAFFLE_PI;

    public String toEnvValue() {
        return switch (this) {
            case BURGER -> "burger";
            case WAFFLE -> "waffle";
            case WAFFLE_PI -> "waffle_pi";
        };
    }
}
