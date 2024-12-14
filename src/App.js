import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import "./App.css";

const App = () => {
  const [workoutBlocks, setWorkoutBlocks] = useState([]);

  const addBlockToWorkout = (block) => {
    setWorkoutBlocks([...workoutBlocks, block]);
  };

  const clearBlocks = () => {
    setWorkoutBlocks([]);
  };

  const Block = ({ type, name }) => {
    const [{ isDragging }, dragRef] = useDrag({
      type: "block",
      item: { type, name },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={dragRef}
        className="block"
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: "move",
        }}
      >
        < div className={`block-visual ${type}`}>
          {type === "two-step-ramp" && (
            <>
              <div className="bar quarter"></div>
              <div className="bar half"></div>
            </>
          )}
          {type === "ramp-up" && (
            <>
              <div className="bar decreasing"></div>
              <div className="bar medium"></div>
              <div className="bar increasing"></div>
              <div className="bar small"></div>
            </>
          )}
          {type === "ramp-down" && (
            <>
              <div className="bar increasing"></div>
              <div className="bar medium"></div>
              <div className="bar decreasing"></div>
              <div className="bar small"></div>
            </>
          )}
        </div>
      </div>
    );
  };

  const WorkoutArea = () => {
    const [, dropRef] = useDrop({
      accept: "block",
      drop: (item) => addBlockToWorkout(item),
    });

    return (
      <div ref={dropRef} className="workout-area">
        <button className="clear-btn" onClick={clearBlocks}>
          Clear Blocks
        </button>
        <div className="workout-track">
          {workoutBlocks.length === 0 ? (
            <p>Drag blocks here to build your workout.</p>
          ) : (
            <BarChart
              width={600}
              height={300}
              data={workoutBlocks.map((block, index) => ({
                name: block.name,
                distance: (index % 3) + 1, // Distribute distance dynamically
                width:
                  block.type === "warm-up"
                    ? 100
                    : block.type === "active"
                    ? 50
                    : block.type === "cool-down"
                    ? 20
                    : block.type === "two-step-ramp"
                    ? 40
                    : block.type === "ramp-up"
                    ? 75
                    : 60,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="distance"
                label={{
                  value: "Distance",
                  position: "insideBottom",
                  dy: 10,
                }}
              />
              <YAxis
                label={{
                  value: "Width (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Bar dataKey="width" fill="#8884d8" />
            </BarChart>
          )}
        </div>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
        {/* Sidebar Section (Left) */}
        <div className="sidebar">
          <h3>Click or drag the blocks to build workout</h3>
          <div className="block-grid">
            <Block type="warm-up" name="Warm Up" />
            <Block type="active" name="Active" />
            <Block type="cool-down" name="Cool Down" />
            <Block type="two-step-ramp" name="Two Step Ramp" />
            <Block type="ramp-up" name="Ramp Up" />
            <Block type="ramp-down" name="Ramp Down" />
          </div>
        </div>

        {/* Right Section (Graph) */}
        <WorkoutArea />

        {/* Bottom Section */}
        <div className="bottom-section">
          <h3>Details of Added Blocks</h3>
          {workoutBlocks.length === 0 ? (
            <p>No blocks added yet.</p> // Display if no blocks are added
          ) : (
            <div className="details-list">
              {workoutBlocks.map((block, index) => {
                const distance = (index % 3) + 1; // Distribute distance dynamically
                return (
                  <div key={index} className="detail-item">
                    <span className="detail-name">
                      {block.name} ({distance} km)
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
