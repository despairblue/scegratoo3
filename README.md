# SceGraToo

This Project is part of my bachelor thesis.

## CI Status and Code Climate
[![Build Status](https://travis-ci.org/despairblue/scegratoo3.png?branch=master)](https://travis-ci.org/despairblue/scegratoo3) [![Code Climate](https://codeclimate.com/github/despairblue/scegratoo3.png)](https://codeclimate.com/github/despairblue/scegratoo3)

## Getting Started
An `npm install` followed by an `npm run watch` should do it.

## Goal

### a web-based 3D scene composition tool within a round-trip engineering framework
* [ ] translate

<!-- Build a web based 3D scene composition tool for the Project `Roundtrip3D` using current web technologies.
The Tool should provide following views and features -->
<!-- - A 3D View to visualize and edit 3D scenes in the X3DOM format -->
<!-- - A tree view to outline and edit 3D scenes in the X3DOM format -->
<!-- - A text view to edit JavaScript code -->
<!-- - A diagram view for SSIML (`Scene Structure and Integration Modelling Language`) models -->
<!-- - optional feature: launch transformation (transforming SSIML to X3DOM and JavaScript and the other way around) jobs on another machine running an eclipse instance -->

<!-- Requirements: model driven software engineering, web development, JavaScript programming, 3D modeling -->

### Ein Web-basiertes Werkzeug zur Komposition von 3D-Szenen innerhalb eines Roundtrop Engineering Frameworks
Für das Projekt Roundtrip3D soll unter Verwendung aktueller Webtechniken ein Web-basiertes 3D-Kompositionswerkzeug erstellt werden. Dadurch soll die Nachbearbeitung generierter X3D-Szenen bzw. deren Weiterverarbeitung innerhalb des Round-trip Prozesses stark vereinfacht werden.

Das Werkzeug soll folgende Sichten und Funktionalitäten bereitstellen:
  * eine 3D-Ansicht zur Visualisierung und Bearbeitung (Komposition) von 3D-Szenen im X3D Format
  * eine Baumansicht zur Darstellung und Bearbeitung von  3D-Szenen im X3D Format
  * eine Textansicht mit Bearbeitungsmöglichkeiten für JavaScript Dokumente
  * eine Diagramm Ansicht für SSIML (Scene Structure and Integration Modelling Language) Modelle
  * es soll möglich sein, Aufrufe von bereits existierenden Transformationen zwischen SSIML Modellen und den Zielsprachen (X3D und JavaScript), über das Webinterface an eine Eclipse-Instanz weiterzuleiten
Sämtliche Modelle/ Daten werden auf einem (Web-) Server gespeichert, auf dem auch die Eclipse-Instanz läuft. Geeignete Methoden aus aktuellen Arbeiten zum kollaborativen Arbeiten an Modellen sowie geeignete Eingabemethoden für 3D-Editoren sollen beleuchtet und ggf. umgesetzt werden.

Anforderungen: Webentwicklung, JavaScript Programmierung, 3D-Modellierung, Eclipse 

## ToDo
- [x] remove sass
- [ ] tree view
- [ ] side based widgets
- [ ] widgets in 3d space

## Stack
- [angularjs](http://angularjs.org/)
- [twitter bootstrap](http://getbootstrap.com/)

## License
Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/
