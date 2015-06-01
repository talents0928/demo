/*jslint */
/*global AdobeEdge: false, window: false, document: false, console:false, alert: false */
(function (compId) {

    "use strict";
    var im='./img/edge/images/',
        aud='media/',
        vid='media/',
        js='js/',
        fonts = {
        },
        opts = {
            'gAudioPreloadPreference': 'auto',
            'gVideoPreloadPreference': 'auto'
        },
        resources = [
        ],
        scripts = [
        ],
        symbols = {
            "stage": {
                version: "5.0.0",
                minimumCompatibleVersion: "5.0.0",
                build: "5.0.0.375",
                scaleToFit: "none",
                centerStage: "none",
                resizeInstances: false,
                content: {
                    dom: [
                        {
                            id: 'Cloud12',
                            type: 'image',
                            rect: ['504px', '245px', '137px', '78px', 'auto', 'auto'],
                            fill: ["rgba(0,0,0,0)",im+"Cloud12.png",'0px','0px']
                        },
                        {
                            id: 'Cloud22',
                            type: 'image',
                            rect: ['-1px', '395px', '130px', '74px', 'auto', 'auto'],
                            fill: ["rgba(0,0,0,0)",im+"Cloud22.png",'0px','0px','100%','100%', 'no-repeat']
                        }
                    ],
                    style: {
                        '${Stage}': {
                            isStage: true,
                            rect: [undefined, undefined, '640px', '600px'],
                            overflow: 'hidden',
                            fill: ["rgba(255,255,255,1)"]
                        }
                    }
                },
                timeline: {
                    duration: 10333.333333333,
                    autoPlay: true,
                    data: [
                        [
                            "eid30",
                            "width",
                            5000,
                            200,
                            "linear",
                            "${Cloud12}",
                            '137px',
                            '120px'
                        ],
                        [
                            "eid31",
                            "width",
                            5200,
                            133,
                            "linear",
                            "${Cloud12}",
                            '120px',
                            '137px'
                        ],
                        [
                            "eid35",
                            "width",
                            10000,
                            200,
                            "linear",
                            "${Cloud12}",
                            '137px',
                            '120px'
                        ],
                        [
                            "eid38",
                            "width",
                            10200,
                            133,
                            "linear",
                            "${Cloud12}",
                            '120px',
                            '137px'
                        ],
                        [
                            "eid2",
                            "left",
                            0,
                            5000,
                            "linear",
                            "${Cloud22}",
                            '0px',
                            '510px'
                        ],
                        [
                            "eid16",
                            "left",
                            5000,
                            200,
                            "linear",
                            "${Cloud22}",
                            '510px',
                            '530px'
                        ],
                        [
                            "eid19",
                            "left",
                            5200,
                            134,
                            "linear",
                            "${Cloud22}",
                            '530px',
                            '510px'
                        ],
                        [
                            "eid20",
                            "left",
                            5333,
                            4667,
                            "linear",
                            "${Cloud22}",
                            '510px',
                            '-1px'
                        ],
                        [
                            "eid27",
                            "left",
                            0,
                            5000,
                            "linear",
                            "${Cloud12}",
                            '504px',
                            '-2px'
                        ],
                        [
                            "eid33",
                            "left",
                            5000,
                            200,
                            "linear",
                            "${Cloud12}",
                            '-2px',
                            '0px'
                        ],
                        [
                            "eid40",
                            "left",
                            5200,
                            133,
                            "linear",
                            "${Cloud12}",
                            '0px',
                            '-1px'
                        ],
                        [
                            "eid41",
                            "left",
                            5333,
                            4667,
                            "linear",
                            "${Cloud12}",
                            '-1px',
                            '503px'
                        ],
                        [
                            "eid36",
                            "left",
                            10000,
                            200,
                            "linear",
                            "${Cloud12}",
                            '503px',
                            '521px'
                        ],
                        [
                            "eid39",
                            "left",
                            10200,
                            133,
                            "linear",
                            "${Cloud12}",
                            '521px',
                            '504px'
                        ],
                        [
                            "eid17",
                            "width",
                            5000,
                            200,
                            "linear",
                            "${Cloud22}",
                            '130px',
                            '110px'
                        ],
                        [
                            "eid18",
                            "width",
                            5200,
                            133,
                            "linear",
                            "${Cloud22}",
                            '110px',
                            '130px'
                        ],
                        [
                            "eid24",
                            "width",
                            10000,
                            200,
                            "linear",
                            "${Cloud22}",
                            '130px',
                            '110px'
                        ],
                        [
                            "eid25",
                            "width",
                            10200,
                            133,
                            "linear",
                            "${Cloud22}",
                            '110px',
                            '130px'
                        ]
                    ]
                }
            }
        };

    AdobeEdge.registerCompositionDefn(compId, symbols, fonts, scripts, resources, opts);

    if (!window.edge_authoring_mode) AdobeEdge.getComposition(compId).load("./img/edge/Part2_edgeActions.js");
})("EDGE-9199730");
