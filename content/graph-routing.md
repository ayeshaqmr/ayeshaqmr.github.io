# Optimizing Vehicle Routing with Graph Theory

In our Data Structures class, we are often asked to implement standard algorithms like Dijkstra's or A* on abstract node networks. I decided to take it a step further by mapping actual city road data and applying algorithms to optimize a waste collection fleet.

## The Problem
Waste collection trucks often run on fixed, static routes. This means they travel the same distance regardless of which bins are actually full, wasting fuel and time.

## The Algorithm
Using `networkx` and Python, I modeled the city as a weighted graph where edges represent road segments and weights represent travel time. The core algorithm was a variation of the **Capacitated Vehicle Routing Problem (CVRP)**.

```python
import networkx as nx

# Create a graph for city intersections
G = nx.Graph()

# Add edges with weights (travel time in minutes)
G.add_edge('NodeA', 'NodeB', weight=4)
G.add_edge('NodeB', 'NodeC', weight=2)

# Find shortest path using Dijkstra
path = nx.dijkstra_path(G, source='NodeA', target='NodeC')
print(f"Optimal route: {path}")
```

## Results
By simulating the optimized routes against the static historical data, the algorithm showed a theoretical **22% reduction in total distance traveled**.

Building this project really bridged the gap between theoretical computer science and practical, high-impact systems engineering.
