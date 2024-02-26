import { Vector3 } from "@speckle/viewer";
import { BatchObject } from "@speckle/viewer";
import { ObjectLayers } from "@speckle/viewer";
import { SpeckleTextMaterial } from "@speckle/viewer";
import { SpeckleText } from "@speckle/viewer";
import { Box3 } from "@speckle/viewer";
import { Extension, IViewer, TreeNode } from "@speckle/viewer";
import { NodeRenderView } from "@speckle/viewer";
import { Vector2, Box3Helper, Color, Matrix4 } from "three";

/** Simple animation data interface */
interface Animation {
  target: BatchObject;
  start: Vector3;
  end: Vector3;
  current: Vector3;
  time: number;
}

export class Categorize extends Extension {
  /** We'll store our animations here */
  private animations: Animation[] = [];
  /** We'll store the boxes for the categories here */
  private categoryBoxes: { [name: string]: Box3 } = {};

  /** Animation params */
  private readonly animTimeScale: number = 0.25;
  private readonly animRadius: number = 80;

  public constructor(viewer: IViewer) {
    super(viewer);
  }

  /** We're tying in to the viewer core's frame event */
  public onLateUpdate(deltaTime: number) {
    if (!this.animations.length) return;

    let animCount = 0;
    for (let k = 0; k < this.animations.length; k++) {
      /** Animation finished, no need to update it */
      if (this.animations[k].time === 1) {
        continue;
      }
      /** Compute the next animation time value */
      const t = this.animations[k].time + deltaTime * this.animTimeScale;
      /** Clamp it to 1 */
      this.animations[k].time = Math.min(t, 1);
      /** Compute current position value based on animation time */
      const value = new Vector3().copy(this.animations[k].start).lerp(
        this.animations[k].end,
        this.easeInOutQuint(this.animations[k].time) // Added easing
      );
      /** Apply the translation */
      this.animations[k].target.transformTRS(
        value.sub(this.animations[k].current),
        undefined,
        undefined,
        undefined
      );
      animCount++;
    }

    /** If any animations updated, request a render */
    if (animCount) this.viewer.requestRender();
  }

  public onRender() {
    // NOT IMPLEMENTED for this example
  }
  public onResize() {
    // NOT IMPLEMENTED for this example
  }

  /** Example's main function */
  public async run() {
    const categories: { [id: string]: NodeRenderView[] } = {};

    await this.viewer.getWorldTree().walkAsync((node: TreeNode) => {
      if (!node.model.atomic || this.viewer.getWorldTree().isRoot(node))
        return true;
      const category = node.model.raw.category;
      if (category) {
        if (!categories[category]) {
          categories[category] = [];
        }
        categories[category].push(node);
      }
      return true;
    });

    /** We'll place the categories on a circle around world origin */

    /** This is the offset between each category in radians */
    const thetaOffset = (2 * Math.PI) / Object.keys(categories).length;

    /** This is the current theta value */
    let theta = 0;
    /** We go over each category */
    for (const cat in categories) {
      const group = categories[cat];
      const offset = new Vector2();
      const categoryBox = new Box3();

      /** This is the origin of each category in cartesian */
      const groupOrigin = new Vector3(
        this.animRadius * Math.sin(theta),
        this.animRadius * Math.cos(theta),
        0
      );

      /** We go over each node in the category */
      for (let k = 0; k < group.length; k++) {
        const node = group[k];
        /** Get the render views */
        const rvs = this.viewer
          .getWorldTree()
          .getRenderTree()
          .getRenderViewsForNode(node, node);

        /** Get the batch objects which we'll animate */
        const objects = rvs.map((rv: NodeRenderView) => {
          return this.viewer.getRenderer().getObject(rv);
        });
        /** Filter out null values. Lines and points do not have
         * corresponding batch objects for now
         */
        objects.filter((obj: BatchObject) => obj);

        /** Compute the union of all the batch objects bounds in the node */
        const unionBox: Box3 = new Box3();
        objects.forEach((obj: BatchObject) => {
          unionBox.union(obj.renderView.aabb);
        });
        /** Get the union box's size and origin */
        const size = unionBox.getSize(new Vector3());
        const origin = unionBox.getCenter(new Vector3());

        objects.forEach((obj: BatchObject) => {
          /** Compute end position for all batch objects */
          const pos = new Vector3().copy(groupOrigin);
          pos.sub(origin);
          /** Add animation */
          this.animations.push({
            target: obj,
            start: new Vector3(),
            end: new Vector3(pos.x + offset.x, pos.y + offset.y, pos.z),
            current: new Vector3(),
            time: 0
          });
          /** Compute the end position bounds for each object */
          const box = new Box3().copy(obj.aabb);
          box.applyMatrix4(
            new Matrix4().makeTranslation(
              pos.x + offset.x,
              pos.y + offset.y,
              pos.z
            )
          );
          /** Accumulate the object boxes into the category boxes */
          categoryBox.union(box);
        });

        /** Increase offset x */
        offset.x += Math.max(size.x, size.y, size.z);
        /** To avoid translating objects to a long single file formation
         * we put them on multiple rows in a simple fast way
         */
        if (offset.x > 20) {
          offset.x = 0;
          offset.y += 10;
        }
      }
      /** Increase the category angle */
      theta += thetaOffset;

      /** Store the category boxes */
      if (!categoryBox.isEmpty()) this.categoryBoxes[cat] = categoryBox;
    }

    /** At this point, all objects have their end position computed
     *  We'll start on adding the category boxes and texts
     */
    for (const k in this.categoryBoxes) {
      /** Expand the category box a bit */
      const box = new Box3()
        .copy(this.categoryBoxes[k])
        .expandByVector(new Vector3(1.2, 1.2, 0));
      /** Flatten the boxes, We basically want rectangles */
      const size = box.getSize(new Vector3());
      box.min.z = -size.z * 0.5;
      box.max.z = -size.z * 0.5;

      /** We'll be drawing the boxes using three's BoxHelpers */
      const boxHelper = new Box3Helper(box, new Color(0x047efb));
      /** Set the layers to PROPS, so that AO and interactions will ignore them */
      boxHelper.layers.set(ObjectLayers.PROPS);
      /** Add the BoxHelper to the scene */
      this.viewer.getRenderer().scene.add(boxHelper);

      /** Create a speckle text object */
      const text = new SpeckleText("test-text");
      /** Simple text material */
      text.textMesh.material = new SpeckleTextMaterial(
        {
          color: 0x047efb,
          opacity: 1
        },
        []
      );
      /** We don't want tonemapping */
      text.textMesh.material.toneMapped = false;
      /** Color to linear space */
      text.textMesh.material.color.convertSRGBToLinear();
      /** Set the layers to PROPS, so that AO and interactions will ignore them */
      text.layers.set(ObjectLayers.PROPS);
      text.textMesh.layers.set(ObjectLayers.PROPS);
      /** Update the text with the cateogry name, size and anchor */
      text
        .update({
          textValue: k,
          height: 2,
          anchorX: "50%",
          anchorY: "0%"
        })
        .then(() => {
          /** Move the text to the bottom center of the category box */
          text.setTransform(
            box.getCenter(new Vector3()).sub(new Vector3(0, size.y * 0.5, 0))
          );
        });
      /** Add the text to the scene */
      this.viewer.getRenderer().scene.add(text);
    }
  }

  /** Simple utility easing function */
  private easeInOutQuint(x: number): number {
    return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
  }
}
