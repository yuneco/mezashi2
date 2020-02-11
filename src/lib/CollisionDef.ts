import Vue from 'vue'
export default interface CollisionDef {
  uid: string;
  tagName: string;
  safeMargin: number;
  onhit: ((target: Vue, tagName: string, index: number) => void) | null;
}
