import React from "react";
import type { RequestParams } from "../../types.ts";
import page from "../_layout/page.tsx";
import { htmlResponse } from "../../utils/response.ts";

export default (requestParams: RequestParams): Promise<Response> =>
  htmlResponse(page(requestParams, header, main));

const header = (
  <>
    <h1>Computer Science Across the Curriculum</h1>
    <p>
      As part of a joint project between Oxford University and Queen Mary, University of London, and
      with funding from the Department for Education, a draft book entitled “Computer Science Across
      the Curriculum” was written, to illustrate the value of Computer Science in various different
      aspects of the national curriculum. The programs developed during this project have since been
      absorbed into the Turtle System, and the materials have been adapted into our{" "}
      <a href="/documentation/programming">programming guides</a>. Links to online versions of the
      programs are available here.
    </p>
  </>
);

const main = (
  <>
    <ol className="csac-examples">
      <li>
        <b>1. Computing in Physics: Cannons and Rockets</b>
        <ol className="csac-examples">
          <li>
            <a href="/run?x=GravitySteps">1.1 Movement under gravity</a>
          </li>
          <li>
            <a href="/run?x=AimCannon">1.2 Firing a cannon (manual)</a>
          </li>
          <li>
            <a href="/run?x=AutoCannon">1.3 Firing a cannon (automatic)</a>
          </li>
          <li>
            <a href="/run?x=Launch">1.4 Launching a rocket into orbit</a>
          </li>
        </ol>
      </li>
      <li>
        <b>2. Cellular Automata: Modelling Disease, “Life”, and Shell Patterns</b>
        <ol className="csac-examples">
          <li>
            <a href="/run?x=LifeStart">2.1 Initialising Conway's Game of Life</a>
          </li>
          <li>
            <a href="/run?x=GameOfLife">2.2 Conway's Game of Life</a>
          </li>
          <li>
            <a href="/run?x=Disease">2.3 Spread of disease</a>
          </li>
          <li>
            <a href="/run?x=Automata">2.4 One-dimensional cellular automata</a>
          </li>
        </ol>
      </li>
      <li>
        <b>3. Computing in Chemistry: Diffusion and Brownian Motion</b>
        <ol className="csac-examples">
          <li>
            <a href="/run?x=Diffusion">3.1 A model of diffusion</a>
          </li>
          <li>
            <a href="/run?x=BrownianMotion">3.2 Brownian motion</a>
          </li>
        </ol>
      </li>
      <li>
        <b>4. Computing in Biology: Evolution and Behaviour</b>
        <ol className="csac-examples">
          <li>
            <a href="/run?x=Cheetahs">4.1 Cheetahs and gazelles</a>
          </li>
          <li>
            <a href="/run?x=SexRatio">4.2 The sex ratio</a>
          </li>
          <li>
            <a href="/run?x=Flocking">4.3 Flocking behaviour</a>
          </li>
        </ol>
      </li>
      <li>
        <b>5. Chaos, Recursion, and Self-Similarity</b>
        <ol className="csac-examples">
          <li>
            <a href="/run?x=Logistic">5.1 Logistic equation</a>
          </li>
          <li>
            <a href="/run?x=LogisticSpider">5.2 Logistic spider</a>
          </li>
          <li>
            <a href="/run?x=Mandelbrot">5.3 Mandelbrot set</a>
          </li>
          <li>
            <a href="/run?x=MandelbrotMini">5.4 Mandelbrot mini</a>
          </li>
          <li>
            <a href="/run?x=MandelbrotSpectrum">5.5 Mandelbrot spectrum</a>
          </li>
          <li>
            <a href="/run?x=MandelbrotMiniSpectrum">5.6 Mandelbrot mini spectrum</a>
          </li>
          <li>
            <a href="/run?x=Triangles">5.7 Recursive triangles</a>
          </li>
          <li>
            <a href="/run?x=Sierpinski">5.8 Sierpinski triangle</a>
          </li>
          <li>
            <a href="/run?x=SierpinskiDots">5.9 Sierpinski dots</a>
          </li>
          <li>
            <a href="/run?x=IFSBackground">5.10 Iterated function systems (IFS) background</a>
          </li>
          <li>
            <a href="/run?x=SierpinskiColour">5.11 Sierpinski colour</a>
          </li>
          <li>
            <a href="/run?x=SierpinskiIFS">5.12 Sierpinski IFS</a>
          </li>
          <li>
            <a href="/run?x=BarnsleyIFS">5.13 Barnsley IFS</a>
          </li>
          <li>
            <a href="/run?x=BarnsleyColour">5.14 Barnsley colour</a>
          </li>
          <li>
            <a href="/run?x=TreeIFS">5.15 Tree IFS</a>
          </li>
          <li>
            <a href="/run?x=DragonIFS">5.16 Dragon IFS</a>
          </li>
          <li>
            <a href="/run?x=DragonColour">5.17 Dragon colour</a>
          </li>
        </ol>
      </li>
      <li>
        <b>6. Waves and Quantum Mechanics</b>
        <ol className="csac-examples">
          <li>
            <a href="/run?x=Interference">6.1 Interference</a>
          </li>
          <li>
            <a href="/run?x=WaveSuperposer">6.2 Wave superposer</a>
          </li>
          <li>
            <a href="/run?x=TwoSlits">6.3 Young's two-slit experiment</a>
          </li>
        </ol>
      </li>
      <li>
        <b>7. Games and Computer Science</b>
        <ol className="csac-examples">
          <li>
            <a href="/run?x=KnightsTour">7.1 Knight's tour</a>
          </li>
          <li>
            <a href="/run?x=MultiNim">7.2 Nim with multiple piles</a>
          </li>
          <li>
            <a href="/run?x=NoughtsAndCrosses">7.3 Noughts and Crosses</a>
          </li>
        </ol>
      </li>
    </ol>
  </>
);
