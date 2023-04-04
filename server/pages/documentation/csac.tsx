import { React } from "../../../deps.ts"
import type { RequestParams } from "../../types.ts"
import page from "../_layout/page.tsx"
import { htmlResponse } from "../../utils/response.ts"

export default (requestParams: RequestParams): Promise<Response> => htmlResponse(page(requestParams, header, main))

const header = (
  <>
    <h1>Computer Science Across the Curriculum</h1>
    <p>
      As part of a joint project between Oxford University and Queen Mary, University of London, and with funding from
      the Department for Education, a book entitled “Computer Science Across the Curriculum” has been written, to
      illustrate the value of Computer Science in various different aspects of the national curriculum.
    </p>
  </>
)

const main = (
  <>
    <h2>Overview of Contents</h2>
    <p>
      The book contains a general introductory chapter, followed by another that explains how to handle animation and
      movement, after which it moves on to simulations in Physics (notably modelling projectile flight and spacecraft).
      Then a chapter on cellular automata (including a model of disease and cell patterning, and the famous “Game of
      Life”) prepares the way for a chapter on Chemistry, covering models of diffusion and Brownian motion. The chapter
      devoted to Biology includes co-evolution of hunter and prey (cheetahs and gazelles), evolution of the sex ratio,
      and flocking behaviour.
    </p>
    <p>
      Up to this point, the programs have been explained in a fair amount of detail, such as could support teaching in
      class, but the remaining chapters aim instead to give a brief flavour of more advanced material for independent
      exploration, with programs and further detail provided online, but only key ideas discussed in the book. In this
      spirit, there is a chapter on chaos and self-similarity, with mathematical and especially biological examples
      (population dynamics, algae and plant growth); and another chapter on wave phenomena, which is especially relevant
      to Physics. Then follows a chapter on games and computer science — implementing three nice examples from cs4fn
      (tic-tac-toe, Nim, and the knights’ tour), and leading up to the Turing machine — and finally a chapter on
      Philosophy, covering the Turing test and the theory of the syllogism.
    </p>
    <h2>Links to the Programs</h2>
    <ol className="csac-examples">
      <li>
        <b>1. Introduction, Computer Science for Fun, and Turtling</b>
        <ol className="csac-examples">
          <li>
            <a href="/run?x=DrawPause">1.4 Simple drawing with pauses</a>
          </li>
          <li>
            <a href="/run?x=ColourSpiral">1.5 Spiral of colours</a>
          </li>
        </ol>
      </li>
      <li>
        <b>2. Animation and Movement</b>
        <ol className="csac-examples">
          <li>
            <a href="/run?x=MovingBall">2.1 Moving ball (using variables)</a>
          </li>
          <li>
            <a href="/run?x=BouncingBall">2.2 Bouncing ball (using variables)</a>
          </li>
          <li>
            <a href="/run?x=TurtleMove">2.3 (a) Moving ball (using the Turtle)</a>
          </li>
          <li>
            <a href="/run?x=TurtleBounce">2.3 (b) Bouncing ball (using the Turtle)</a>
          </li>
          <li>
            <a href="/run?x=AskInput">2.4.1 Asking for typed input</a>
          </li>
        </ol>
      </li>
      <li>
        <b>3. Computing in Physics: Cannons and Rockets</b>
        <ol className="csac-examples">
          <li>
            <a href="/run?x=GravitySteps">3.1 Movement under gravity</a>
          </li>
          <li>
            <a href="/run?x=AimCannon">3.2 (a) Firing a cannon (manual)</a>
          </li>
          <li>
            <a href="/run?x=AutoCannon">3.2 (b) Firing a cannon (automatic)</a>
          </li>
          <li>
            <a href="/run?x=Launch">3.3 Launching a rocket into orbit</a>
          </li>
        </ol>
      </li>
      <li>
        <b>4. Cellular Automata: Modelling Disease, “Life”, and Shell Patterns</b>
        <ol className="csac-examples">
          <li>
            <a href="/run?x=LifeStart">4.1 Initialising Conway's Game of Life</a>
          </li>
          <li>
            <a href="/run?x=Disease">4.2 Spread of disease</a>
          </li>
          <li>
            <a href="/run?x=GameOfLife">4.5 Conway's Game of Life</a>
          </li>
          <li>
            <a href="/run?x=Automata">4.6 One-dimensional cellular automata</a>
          </li>
        </ol>
      </li>
      <li>
        <b>5. Computing in Chemistry: Diffusion and Brownian Motion</b>
        <ol className="csac-examples">
          <li>
            <a href="/run?x=Diffusion">5.1 A model of diffusion</a>
          </li>
          <li>
            <a href="/run?x=BrownianMotion">5.2 Brownian motion</a>
          </li>
        </ol>
      </li>
      <li>
        <b>6. Computing in Biology: Evolution and Behaviour</b>
        <ol className="csac-examples">
          <li>
            <a href="/run?x=Cheetahs">6.1 Cheetahs and gazelles</a>
          </li>
          <li>
            <a href="/run?x=SexRatio">6.2 The sex ratio</a>
          </li>
          <li>
            <a href="/run?x=Flocking">6.3 Flocking behaviour</a>
          </li>
        </ol>
      </li>
      <li>
        <b>7. Chaos, Recursion, and Self-Similarity</b>
        <ol className="csac-examples">
          <li>
            <a href="/run?x=Logistic">7.1 (a) Logistic equation</a>
          </li>
          <li>
            <a href="/run?x=LogisticSpider">7.1 (b) Logistic spider</a>
          </li>
          <li>
            <a href="/run?x=Mandelbrot">7.2 Mandelbrot set</a>
          </li>
          <li>
            <a href="/run?x=MandelbrotMini">7.2.1 Mandelbrot mini</a>
          </li>
          <li>
            <a href="/run?x=MandelbrotSpectrum">7.2.2 (a) Mandelbrot spectrum</a>
          </li>
          <li>
            <a href="/run?x=MandelbrotMiniSpectrum">7.2.2 (b) Mandelbrot mini spectrum</a>
          </li>
          <li>
            <a href="/run?x=Triangles">7.3 (a) Recursive triangles</a>
          </li>
          <li>
            <a href="/run?x=Sierpinski">7.3 (b) Sierpinski triangle</a>
          </li>
          <li>
            <a href="/run?x=SierpinskiDots">7.3 (c) Sierpinski dots</a>
          </li>
          <li>
            <a href="/run?x=IFSBackground">7.4 (a) Iterated function systems (IFS) background</a>
          </li>
          <li>
            <a href="/run?x=SierpinskiColour">7.4 (b) Sierpinski colour</a>
          </li>
          <li>
            <a href="/run?x=SierpinskiIFS">7.4 (c) Sierpinski IFS</a>
          </li>
          <li>
            <a href="/run?x=BarnsleyIFS">7.5 (a) Barnsley IFS</a>
          </li>
          <li>
            <a href="/run?x=BarnsleyColour">7.5 (b) Barnsley colour</a>
          </li>
          <li>
            <a href="/run?x=TreeIFS">7.5 (c) Tree IFS</a>
          </li>
          <li>
            <a href="/run?x=DragonIFS">7.5 (d) Dragon IFS</a>
          </li>
          <li>
            <a href="/run?x=DragonColour">7.5 (e) Dragon colour</a>
          </li>
        </ol>
      </li>
      <li>
        <b>8. Waves and Quantum Mechanics</b>
        <ol className="csac-examples">
          <li>
            <a href="/run?x=Interference">8.3 Interference</a>
          </li>
          <li>
            <a href="/run?x=WaveSuperposer">8.5 Wave superposer</a>
          </li>
          <li>
            <a href="/run?x=TwoSlits">8.6 Young's two-slit experiment</a>
          </li>
        </ol>
      </li>
      <li>
        <b>9. Games and Computer Science</b>
        <ol className="csac-examples">
          <li>
            <a href="/run?x=KnightsTour">9.1 Knight's tour</a>
          </li>
          <li>
            <a href="/run?x=MultiNim">9.2 Nim with multiple piles</a>
          </li>
          <li>
            <a href="/run?x=NoughtsAndCrosses">9.3 Noughts and Crosses</a>
          </li>
        </ol>
      </li>
    </ol>
  </>
)
