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

Anforderungen: Webentwicklung, JavaScript Programmierung, 3D-Modellierung, Eclipse

## ToDo
- [x] remove sass
- [x] tree view
- [ ] side based widgets
- [x] upload to server
- [x] pick already uploaded files from server
- [x] fork moveable
  - [x] add destroy method to unregister events, otherwise removed inlines keep listening to events (use observables)
  - [ ] fix don't deselect element
  - [ ] fix inlines loose moveable super powers when moved in the tree view
- [ ] xbox controller input
- [ ] related work
  - [ ] collaborative work on documents (tree, text, 3d, whatevs)
  - [ ] widgets in 3d space
- [ ] remove dat gui
- [ ] gliederung

## Gliederung

1. einleitung
  1. motivation
2. grundlagen
  1. roundtrip3d
    round-trip spuckt x3d aus: bearbeiten -> speichern -> wieder einlesen in r3d
    nativ in x3d arbeiten mit option auf collaboratives arbeiten
    x3dom schon vorhanden
  1. x3d
    1. x3dom
  2. react
    1. states and functional programming
  3. koa
  4. stuff that needs explaining
3. related work
  1. collaborative work
  2. 3d widgets
    1. http://www.tiltbrush.com/
    2. x3d gizmos
4. konzeption (pflichtenheft)
  1. wie
    1. server
    2. client
    3. interaction
  3. problems
  4. wie zu lösen
5. umsetzung
  1. used technologies
  1. problems
    1. why backbone sucks, why frameworks suck
  1. ...
6. case study
  1. tasks
  2. results
7. Auswertung
  2. warum es das beste ist oder warum gescheitert


## Stack
- [angularjs](http://angularjs.org/)
- [react]()
- [twitter bootstrap](http://getbootstrap.com/)

## License
Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/
