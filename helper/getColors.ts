export class GetColors {
    static NODE_ACTIVE_COLOR = "#2F5496";
    static NODE_INACTIVE_COLOR = "#e6e6e6";
    static TEXT_ACTIVE = "black";
    static TEXT_INACTIVE = "gray";
    static TEXT_DISABLED = "#e6e6e6";
    private static colors = [ '246,174,45', '242,100,25', '225,29,72','5,150,105', '124,58,237', '2,132,199', '13,148,136', '250,204,1'];

    static generate(){
        return GetColors.colors.shift();
    }
}
