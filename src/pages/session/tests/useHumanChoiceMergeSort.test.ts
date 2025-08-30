import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Item } from '../../list/ListItem';
import { useHumanMergeSort } from '../useHumanChoiceMergeSort';

function fakeItem(name: string): Item {
    return {
        id: '1',
        name,
        image: null,
    };
}

describe('useHumanChoiceMergeSort', () => {
    it('sort array correctly with user choices', () => {
        const { result } = renderHook(() =>
            useHumanMergeSort([fakeItem('a'), fakeItem('b')])
        );

        act(() => {
            result.current.getNextStep();
        });

        // First step: a vs b
        expect(result.current.step?.type).toBe('comparison');

        act(() => {
            result.current.choose('right'); // choose b over a
        });

        expect(result.current.currentArray.map((i) => i.name)).toEqual([
            'b',
            'a',
        ]);
    });

    it('sorts 5 items correctly with user choices', () => {
        // Unsorted array: [e, c, b, a, d]
        const input = ['e', 'c', 'b', 'a', 'd'].map(fakeItem);
        const { result } = renderHook(() => useHumanMergeSort(input));

        // === LEVEL 1 === pairwise merges
        act(() => result.current.getNextStep());
        // e vs c → pick c
        act(() => result.current.choose('right'));
        // b vs a → pick a
        act(() => result.current.choose('right'));
        // d is unpaired → auto goes forward

        // === LEVEL 2 === [c, e] vs [a, b]
        // c vs a → pick a
        act(() => result.current.choose('right'));
        // c vs b → pick b
        act(() => result.current.choose('right'));
        // c,e  (remaining) → c, e

        // === LEVEL 3 === [a, b, c, e] vs [d]
        // a vs d → a
        act(() => result.current.choose('left'));
        // b vs d → b
        act(() => result.current.choose('left'));
        // c vs d → c
        act(() => result.current.choose('left'));
        // e vs d → d
        act(() => result.current.choose('right'));

        // === Final Assertions ===
        expect(result.current.isComplete).toBe(true);
        expect(result.current.step?.type).toBe('complete');
        expect(result.current.currentArray.map((i) => i.name)).toEqual([
            'a',
            'b',
            'c',
            'd',
            'e',
        ]);
    });

    it('sorts 8 items correctly with user choices', () => {
        const input = ['h', 'f', 'd', 'b', 'g', 'e', 'c', 'a'].map(fakeItem);
        const { result } = renderHook(() => useHumanMergeSort(input));

        // Start sorting process
        act(() => result.current.getNextStep());

        // === LEVEL 1 ===
        // h vs f → f
        act(() => result.current.choose('right'));
        // d vs b → b
        act(() => result.current.choose('right'));
        // g vs e → e
        act(() => result.current.choose('right'));
        // c vs a → a
        act(() => result.current.choose('right'));

        // === LEVEL 2 ===
        // [f, h] vs [b, d]
        // f vs b → b
        act(() => result.current.choose('right'));
        // f vs d → d
        act(() => result.current.choose('right'));

        // [e, g] vs [a, c]
        // e vs a → a
        act(() => result.current.choose('right'));
        // e vs c → c
        act(() => result.current.choose('right'));

        // === LEVEL 3 ===
        // [b, d, f, h] vs [a, c, e, g]
        // b vs a → a
        act(() => result.current.choose('right'));
        // b vs c → b
        act(() => result.current.choose('left'));
        // d vs c → c
        act(() => result.current.choose('right'));
        // d vs e → d
        act(() => result.current.choose('left'));
        // f vs e → e
        act(() => result.current.choose('right'));
        // f vs g → f
        act(() => result.current.choose('left'));
        // h vs g → g
        act(() => result.current.choose('right'));

        // Auto-completes remaining item (h)

        // === Final Assertions ===
        expect(result.current.isComplete).toBe(true);
        expect(result.current.step?.type).toBe('complete');
        expect(result.current.currentArray.map((i) => i.name)).toEqual([
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g',
            'h',
        ]);
    });
});
