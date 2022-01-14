export class GetColors {
    private static colors = ['246,174,45', '242,100,25', '225,29,72','5,150,105', '124,58,237', '2,132,199', '13,148,136', '250,204,1'];
    static generate(){
        return GetColors.colors.shift();
    }
}