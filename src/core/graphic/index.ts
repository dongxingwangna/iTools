/**
 * @docName: index.ts
 * @Author: wdx
 * @Date: 2022/9/24  14:41
 */

import { Point } from './Point';
import { PointInfo } from './PointInfo';
import { logger } from '../../utils/debug/debug';

const log = logger.extend('graphic');
/**
 * 获取点到线段的距离
 * @param point {Point}
 * @param lineStart {Point}
 * @param lienEnd {Point}
 */
export function getTheDistanceOfAPointLineSegment(point: Point, lineStart: Point, lienEnd: Point): number {
  if (lineStart.x === lienEnd.x && lineStart.y === lienEnd.y)
    return Math.sqrt(
      (point.x - lineStart.x) * (point.x - lineStart.x) + (point.y - lineStart.y) * (point.y - lineStart.y),
    );
  const r: number =
    ((point.x - lineStart.x) * (lienEnd.x - lineStart.x) + (point.y - lineStart.y) * (lienEnd.y - lineStart.y)) /
    ((lienEnd.x - lineStart.x) * (lienEnd.x - lineStart.x) + (lienEnd.y - lineStart.y) * (lienEnd.y - lineStart.y));
  if (r <= 0)
    return Math.sqrt(
      (point.x - lineStart.x) * (point.x - lineStart.x) + (point.y - lineStart.y) * (point.y - lineStart.y),
    );
  if (r >= 1)
    return Math.sqrt((point.x - lienEnd.x) * (point.x - lienEnd.x) + (point.y - lienEnd.y) * (point.y - lienEnd.y));
  const px = lineStart.x + (lienEnd.x - lineStart.x) * r;
  const py = lineStart.y + (lienEnd.y - lineStart.y) * r;
  return Math.sqrt((point.x - px) * (point.x - px) + (point.y - py) * (point.y - py));
}

/**
 * 判断点是否在另一个点区域内
 * @param point {Point}
 * @param areaPoint {Point}
 * @param radius {number}
 * @param type {string}
 */
export function determineIfAPointIsWithinAnotherPointArea(
  point: Point,
  areaPoint: Point,
  radius: number = 5,
  type: string = 'round',
): boolean {
  if (type === 'round') {
    return Math.pow(point.x - areaPoint.x, 2) + Math.pow(point.y - areaPoint.y, 2) <= Math.pow(radius, 2);
  } else if (type === 'square') {
    return Math.abs(point.x - areaPoint.x) <= radius && Math.abs(point.y - areaPoint.y) <= radius;
  }
  log(`type Error: in determineIfAPointIsWithinAnotherPointArea ${type}，optionalParameter round or square`);
  return false;
}

/**
 * 获取点到线的最短距离
 * @param point {Point}
 * @param lineStart {Point}
 * @param lineEnd {Point}
 */
export function getTheDistanceFromPointToLine(point: Point, lineStart: Point, lineEnd: Point): number {
  let len;
  if (lineStart.x - lineEnd.x === 0) {
    len = Math.abs(point.x - lineStart.x);
  } else {
    const A = (lineStart.y - lineEnd.y) / (lineStart.x - lineEnd.x);
    const B = lineStart.y - A * lineStart.x;
    len = Math.abs((A * point.x + B - point.y) / Math.sqrt(A * A + 1));
  }
  return len;
}

/**
 * 获取两点距离
 * @param point
 * @param point2
 */
export function getTheDistanceBetweenTwoPoints(point: Point, point2: Point): number {
  return Math.sqrt(Math.pow(point.x - point2.x, 2) + Math.pow(point.y - point2.y, 2));
}

/**
 * 获取两点与x轴夹角
 * @param point
 * @param point2
 * @param isDirection 是否判断方向
 */
export function obtainTheAngleBetweenTwoPointsAndTheXAxis(
  point: Point,
  point2: Point,
  isDirection: boolean = false,
): number {
  const dy = point2.y - point.y;
  const dis = getTheDistanceBetweenTwoPoints(point, point2);
  let rote = dis > 0 ? Math.round((Math.asin(dy / dis) / Math.PI) * 180) : 0;
  if (point2.x < point.x && isDirection) {
    rote = 180 - rote;
  }
  return rote;
}

/**
 * 获取距离最近的点
 * @param point
 * @param points
 */
export function getTheClosestPoint(point: Point, points: Point[]): PointInfo {
  let index: number = 0;
  const data: Point = new Point(points[0].x, points[0].y);
  const dif: number = getTheDistanceBetweenTwoPoints(point, points[0]);
  for (let i = 0; i < points.length; i++) {
    if (getTheDistanceBetweenTwoPoints(point, points[i]) < dif) {
      index = i;
      data.x = points[i].x;
      data.y = points[i].y;
    }
  }
  return {
    index,
    data,
  };
}

/**
 * 获取圆上的点
 * @param point
 * @param angle
 * @param r
 * @param startDirection
 * @param clockwiseOrNot
 */
export function gettingPointsOnACircle(
  point: Point,
  angle: number,
  r: number,
  startDirection: string = 'right',
  clockwiseOrNot: boolean = false,
) {
  switch (startDirection) {
    case 'top':
      angle += 90;
      break;
    case 'left':
      angle += 180;
      break;
    case 'bottom':
      angle += 270;
      break;
    default:
      angle += 0;
  }
  let radian = ((2 * Math.PI) / 360) * angle;
  if (clockwiseOrNot) {
    radian = radian * -1;
  }
  return new Point(Number((Math.cos(radian) * r).toFixed(2)), Number((Math.sin(radian) * r).toFixed(2)));
}

/**
 * 判断点是否在线的节点上
 * @param point
 * @param points
 * @param radius
 * @param type
 */
export function judgeWhetherThePointIsOnline(
  point: Point,
  points: Point[],
  radius?: number,
  type?: string,
): { index: number; data: Point } {
  const res: {
    index: number;
    data: Point;
  } = {
    index: -1,
    data: new Point(0, 0),
  };
  for (let i = 0; i < points.length; i++) {
    const b = determineIfAPointIsWithinAnotherPointArea(point, points[i], radius, type);
    if (b) {
      res.index = i;
      res.data = points[i];
    }
  }
  return res;
}
