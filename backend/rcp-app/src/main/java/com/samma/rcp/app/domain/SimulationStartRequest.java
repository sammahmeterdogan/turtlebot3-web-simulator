package com.samma.rcp.app.domain;

/**
 * İsteğe bağlı: UI "start" ederken model/scenario göndermek isterse.
 * Boş gelirse orchestrator mevcut varsayılanı kullanır.
 */
public class SimulationStartRequest {
    private String robotModel; // örn: waffle, burger
    private String scenario;   // örn: teleop, slam
    // gerekirse ek alanlar…

    public String getRobotModel() { return robotModel; }
    public void setRobotModel(String robotModel) { this.robotModel = robotModel; }

    public String getScenario() { return scenario; }
    public void setScenario(String scenario) { this.scenario = scenario; }
}
