import { CommandContext, CommandContextBuilder, CommandNode, StringReader, Suggestions, SuggestionsBuilder } from '../internal';

export class RootCommandNode<S> extends CommandNode<S> {

    constructor() {
        super(null, c => Promise.resolve(true), null, c => null, false);
    }

    parse(reader: StringReader, contextBuilder: CommandContextBuilder<S>): void {
    }

    getName(): string {
        return "";
    }

    getUsageText(): string {
        return "";
    }

    listSuggestions(context: CommandContext<S>, builder: SuggestionsBuilder): Promise<Suggestions> {
        return Suggestions.empty();
    }
}
