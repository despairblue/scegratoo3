# SceGraToo

This Project is part of my bachelor thesis.

## CI Status and Code Climate
[![Build Status](https://travis-ci.org/despairblue/scegratoo3.png?branch=master)](https://travis-ci.org/despairblue/scegratoo3) [![Code Climate](https://codeclimate.com/github/despairblue/scegratoo3.png)](https://codeclimate.com/github/despairblue/scegratoo3)

## Getting Started
An `npm install` followed by an `npm run watch` should do it.

## Goal

### Building a web based 3D composition tool.

Build a web based 3D scene composition tool for the Project `Roundtrip3D` using current web technologies.
The Tool should provide following views and features
- A 3D View to visualize and edit 3D scenes in the X3DOM format
- A tree view to outline and edit 3D scenes in the X3DOM format
- A text view to edit JavaScript code
- A diagram view for SSIML (`Scene Structure and Integration Modelling Language`) models
- optional feature: launch transformation (transforming SSIML to X3DOM and JavaScript and the other way around) jobs on another machine running an eclipse instance

Requirements: model driven software engineering, web development, JavaScript programming, 3D modeling

### German for Matze

Erstellung eines Web-basierten 3D Kompositionswerkzeuges
Für das Projekt Roundtrip3D soll ein Web-basiertes 3D Szenen-Kompositionswerkzeug erstellt
werden, unter Verwendung aktueller Webtechniken.
Das Werkzeug soll folgende Sichten und Funktionalitäten bereitstellen:

- eine 3D Ansicht zur Visualisierung und Bearbeitung von 3D Szenen im X3D Format
- eine Baum Ansicht zur Darstellung und Bearbeitung von 3D Szenen im X3D Format
- eine Textansicht mit Bearbeitungsmöglichkeiten für JavaScript Dokumente
- eine Diagramm Ansicht für SSIML (Scene Structure and Integration Modelling Language)
Modelle
- es soll möglich sein Transformationsaufrufe (Roundtrip-Szenario) zwischen SSIML

Modellen und den Zielsprachen (X3D und JavaScript) über das Webinterface an eine
Eclipse-Instanz weiterzuleiten
Sämtliche Modelle/ Daten werden auf einem Webserver gespeichert, wo auch die Eclipse-Instanz
läuft.
Geeignete Methoden aus aktuellen Arbeiten zum kollaborativen Arbeiten an Modellen sollen
beleuchtet werden.
Anforderungen: Webentwicklung, JavaScript Programmierung, 3D-Modellierung, Eclipse

## Stack
- [angularjs](http://angularjs.org/)
- [twitter bootstrap](http://getbootstrap.com/)

## License
Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/
