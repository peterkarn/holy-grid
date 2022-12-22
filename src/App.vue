<template>
  <div class="grid" :style="gridTemplate">
    <button v-for="cell in gridCells"
      :key="cell.id"
      @click="cellClickHandler(cell)"
      :class="{'hidden' : cell.status === 'hidden'}"
    >
      <span v-if="cell.isHole">H</span>
      <span v-else>{{cell.nearbyHoles}}</span>
    </button>
  </div>
</template>

<script lang="ts">

import {
  reactive, defineComponent, computed, onMounted,
} from 'vue';
import { Cell } from '@/models/Cell';
import { HolePosition } from '@/models/HolePosition';

export default defineComponent({
  name: 'App',
  setup() {
    const gridCells = reactive<Cell[]>([]);
    const gridSize = 4;
    const numberOfHoles = 4;

    const generateGrid = () => {
      for (let x = 0; x < gridSize; x += 1) {
        for (let y = 0; y < gridSize; y += 1) {
          const cell: Cell = {
            id: `id${x} + ${y}`,
            x,
            y,
            isHole: false,
            status: 'hidden',
            nearbyHoles: null,
          };
          gridCells.push(cell);
        }
      }
    };

    const randomNumber = (max: number): number => Math.floor(Math.random() * max);
    const comparePositions = (a: HolePosition, b: HolePosition) => a.x === b.x && a.y === b.y;

    const getHolesPositions = (gridMaxSize: number, holes: number) => {
      const gridHolesPositions : HolePosition[] = [];
      while (gridHolesPositions.length < holes) {
        const position : HolePosition = {
          x: randomNumber(gridMaxSize),
          y: randomNumber(gridMaxSize),
        };

        if (!gridHolesPositions.some((pos) => comparePositions(position, pos))) {
          gridHolesPositions.push(position);
        }
      }

      return gridHolesPositions;
    };

    const holePositions = getHolesPositions(gridSize, numberOfHoles);

    const locateCellByCoordinates = (target: Cell | HolePosition) => {
      const { x, y } = target;
      const match: any | Cell = gridCells
        .find((cell: Cell) => cell.x === x && cell.y === y);
      return match;
    };

    const putHolesToTheGrid = () => {
      holePositions.forEach((hole) => {
        const matchedCell = locateCellByCoordinates(hole);
        if (matchedCell) matchedCell.isHole = true;
      });
    };

    const getCellSiblings = (clickedCell : Cell) => {
      const siblings: Cell[] = [];
      const match = locateCellByCoordinates(clickedCell);

      const { x: matchX, y: matchY } = match;

      for (let xShift = -1; xShift <= 1; xShift += 1) {
        for (let yShift = -1; yShift <= 1; yShift += 1) {
          const cellSibling = gridCells
            .find((cell : Cell) => cell.x === (matchX + xShift) && cell.y === (matchY + yShift));
          if (cellSibling) siblings.push(cellSibling);
        }
      }
      return siblings;
    };

    const cellClickHandler = (clickedCell: Cell) => {
      const nearbyHoles = getCellSiblings(clickedCell)
        .filter((cell) => cell.isHole === true).length;
      if (clickedCell.status === 'hidden') {
        // eslint-disable-next-line no-param-reassign
        clickedCell.status = 'revealed';
        // eslint-disable-next-line no-param-reassign
        clickedCell.nearbyHoles = nearbyHoles;
      }
      return nearbyHoles;
    };

    const gridTemplate = computed(() => (
      {
        'grid-template-columns': `repeat(${gridSize}, 30px)`,
        'grid-template-rows': `repeat(${gridSize}, 30px)`,
      }
    ));

    onMounted(() => {
      generateGrid();
      putHolesToTheGrid();
    });

    return {
      gridTemplate, gridCells, getCellSiblings, cellClickHandler,
    };
  },

});

</script>

<style>
  .grid {
    display: grid;
    gap: 20px;
  }

  .hidden {
    font-size: 0;
    background-color: brown;
    cursor: pointer;
  }
</style>
