import deepPickBy from '@/utils/deepPickBy';

describe('deepPickBy', () => {
  test('should pick valid properties from a nested object', () => {
    const data = {
      a: 1,
      b: undefined,
      c: {
        d: 2,
        e: undefined,
        f: {
          g: 3,
          h: undefined,
        },
      },
    };

    const predicate = (val: any): boolean => val !== undefined;

    const result = deepPickBy(data, predicate);

    expect(result).toEqual({
      a: 1,
      c: {
        d: 2,
        f: {
          g: 3,
        },
      },
    });
  });
});
