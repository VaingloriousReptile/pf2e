import { RuleElementPF2e } from "../../rule-element";
import { RuleElementData, RuleElementSource } from "@module/rules/rules-data-definitions";
import { ItemPF2e } from "@item";

/** @category RuleElement */
abstract class IWRRuleElement extends RuleElementPF2e {
    constructor(data: IWRRuleElementSource, item: Embedded<ItemPF2e>) {
        if (typeof data.type !== "string") {
            data.ignored = true;
        }
        super(data, item);
    }

    abstract dictionary: Record<string, string | undefined>;

    abstract get property(): unknown[];

    validate(value: unknown): boolean {
        return (
            this.data.type in this.dictionary &&
            typeof value === "number" &&
            value > 0 &&
            (!this.data.except || typeof this.data.except === "string")
        );
    }

    abstract getIWR(value?: unknown): string | object | null;

    override onBeforePrepareData(): void {
        if (this.ignored) return;

        const value: unknown = this.resolveValue();
        if (!(this.validate(value) && typeof this.data.type === "string" && this.data.type in this.dictionary)) {
            this.ignored = true;
            return;
        }
        const iwrElement = this.getIWR(value);
        if (iwrElement) this.property.push(iwrElement);
    }
}

interface IWRRuleElement extends RuleElementPF2e {
    data: IWRRuleElementData;
}

interface IWRRuleElementSource extends RuleElementSource {
    type?: unknown;
    except?: unknown;
    override?: unknown;
}

export interface IWRRuleElementData extends RuleElementData {
    type: string;
    /** Exceptions to the IWR */
    except?: string;
    /** Whether to override an existing value even if it's higher */
    override: boolean;
}

export { IWRRuleElement };
